import { env } from '@/data/env/server';
import { getExerciseDataById } from '@/features/exercises/data/getExerciseDataById';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

function getSubjectPrompt(subject: string, grade: string) {
    const subjectPrompts: Record<string, string> = {
        toan: `Bạn là giáo viên Toán lớp ${grade}. Trình bày rõ các bước giải, công thức, phương pháp. Nếu bài làm KHÔNG liên quan, hãy cảnh báo.`,
        van: `Bạn là giáo viên Ngữ Văn lớp ${grade}. Phân tích câu chữ, ý chính. Nếu hình không chứa chữ hoặc không liên quan, hãy cảnh báo.`,
        anh: `Bạn là giáo viên Tiếng Anh lớp ${grade}. Phân tích từ vựng, ngữ pháp. Nếu không liên quan, hãy cảnh báo.`,
    };
    return subjectPrompts[subject] || `Bạn là giáo viên lớp ${grade}.`;
}

const getMimeType = (file: File | { name: string; mimeType: string }) => {
    const fileName = file instanceof File ? file.name : file.name;
    const fileMimeType = file instanceof File ? file.type : file.mimeType;

    if (fileMimeType && fileMimeType !== 'application/octet-stream') return fileMimeType;

    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'pdf':
            return 'application/pdf';
        case 'webp':
            return 'image/webp';
        default:
            return 'image/png';
    }
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const submissionFiles = formData.getAll('submission') as File[];
        const exerciseId = formData.get('exerciseId') as string | null;
        const grade = formData.get('grade') as string | null;
        const subject = formData.get('subject') as string | null;

        if (!submissionFiles.length || !exerciseId)
            return NextResponse.json(
                { message: 'Thiếu file bài làm hoặc ID bài tập.' },
                { status: 400 },
            );
        if (!grade || !subject)
            return NextResponse.json({ message: 'Thiếu lớp hoặc môn học.' }, { status: 400 });

        // 1. Lấy File Đề bài từ S3
        const exerciseData = (await getExerciseDataById(exerciseId)) as {
            fileData:
                | {
                      name: string;
                      data: string; // Base64 string
                      mimeType: string;
                      isSolution: boolean;
                  }[]
                | null;
        } | null;

        if (!exerciseData || !exerciseData.fileData || exerciseData.fileData.length === 0) {
            return NextResponse.json(
                { message: 'Không tìm thấy file đề bài gốc trong S3.' },
                { status: 404 },
            );
        }

        // Lọc ra file đề bài (Giả định file đề bài có isSolution: false)
        const problemDataS3 = exerciseData.fileData.filter((f) => !f.isSolution);

        if (problemDataS3.length === 0) {
            return NextResponse.json(
                { message: 'Không tìm thấy file đề bài hợp lệ trong dữ liệu S3.' },
                { status: 404 },
            );
        }

        // 2. Xử lý file Bài làm của Học sinh (từ upload)
        const submissionDataStudent = await Promise.all(
            submissionFiles.map(async (f) => ({
                name: f.name,
                data: Buffer.from(await f.arrayBuffer()).toString('base64'),
                mimeType: getMimeType(f),
            })),
        );

        // 3. Chuẩn bị Prompt
        const problemList = problemDataS3.map((f) => `- Đề bài: ${f.name}`).join('\n');
        const submissionList = submissionDataStudent.map((f) => `- Bài làm: ${f.name}`).join('\n');

        const textPrompt = `
            Bạn là giáo viên AI lớp ${grade}, môn ${subject}.
            ${getSubjectPrompt(subject, grade)}

            Nhiệm vụ:
            1️⃣ Đọc kỹ các file "Đề bài" và "Bài làm".
            2️⃣ **QUAN TRỌNG:** Nếu bài làm KHÔNG LIÊN QUAN đến đề bài, KHÔNG chứa chữ, hoặc là hình ảnh/file vớ vẩn, hãy đặt "isRelevant": false. Nếu hợp lệ, đặt "isRelevant": true.
            3️⃣ Nếu hợp lệ ("isRelevant": true), phân tích từng câu theo cấu trúc:
            {
            "questions": [
                {
                "id": 1,
                "question": "Tóm tắt nội dung đề bài 1",
                "aiAnswer": "Lời giải chi tiết và chính xác do AI tạo ra.",
                "type": "Trắc nghiệm/Tự luận",
                "feedback": "Phân tích, ưu điểm, nhược điểm, lời khuyên về bài làm của học sinh."
                }
            ],
            "generalFeedback": "Nhận xét chung cho toàn bộ bài.",
            "examType": "Trắc nghiệm + Tự luận"
            }
            4️⃣ Nếu KHÔNG hợp lệ ("isRelevant": false):
            {
                "isRelevant": false,
                "questions": [],
                "generalFeedback": "Cảnh báo: Bài làm của bạn có vẻ không liên quan tới bài tập đã chọn. Vui lòng kiểm tra lại file nộp.",
                "examType": []
            }
            Hãy đảm bảo trả về **chuẩn JSON** và không có ký tự thừa.
            ĐỀ BÀI:[PAR]
            ${problemList.split('\n').join('[LINE]')}
            BÀI LÀM:[PAR]
            ${submissionList.split('\n').join('[LINE]')}
            `;

        const genAI = new GoogleGenerativeAI(env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const inputs = [
            {
                role: 'user',
                parts: [
                    { text: textPrompt },
                    // exercise
                    ...problemDataS3.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                    // solution
                    ...submissionDataStudent.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                ],
            },
        ];

        // 5. Gọi API Gemini
        const result = await model.generateContent({ contents: inputs });
        const aiText = result.response.text();

        // 6. Xử lý và parse JSON thô (Giữ nguyên logic của bạn)
        const cleanedText = aiText
            .replace(/^```json\s*/, '')
            .replace(/```$/, '')
            .trim();

        let aiJson = { questions: [], generalFeedback: '', examType: [] } as {
            questions: { id: number; question: string; aiAnswer: string; type: string }[];
            generalFeedback: string;
            examType: string | string[];
        };
        try {
            aiJson = JSON.parse(cleanedText);

            aiJson.examType =
                typeof aiJson.examType === 'string' && aiJson.examType
                    ? aiJson.examType.split('+').map((s: string) => s.trim())
                    : [];
        } catch {
            console.warn('Cannot parse AI response as JSON, fallback to text.');
            aiJson.generalFeedback = cleanedText;
            aiJson.examType = [];
        }

        return NextResponse.json({ data: aiJson }, { status: 200 });
    } catch (error) {
        console.error('❌ Lỗi AI:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
