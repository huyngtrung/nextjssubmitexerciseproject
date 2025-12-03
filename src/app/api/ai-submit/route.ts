import { env } from '@/data/env/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

function getSubjectPrompt(subject: string, grade: string) {
    const subjectPrompts: Record<string, string> = {
        toan: `Bạn là giáo viên Toán lớp ${grade}. Trình bày rõ các bước giải, công thức, phương pháp. Nếu bài làm KHÔNG liên quan, hãy cảnh báo.`,
        van: `Bạn là giáo viên Ngữ Văn lớp ${grade}. Phân tích câu chữ, ý chính. Nếu hình không chứa chữ hoặc không liên quan, hãy cảnh báo.`,
        ly: `Bạn là giáo viên Lý lớp ${grade}. Chú ý công thức, minh họa. Nếu hình không chứa nội dung bài học, cảnh báo.`,
        anh: `Bạn là giáo viên Tiếng Anh lớp ${grade}. Phân tích từ vựng, ngữ pháp. Nếu không liên quan, hãy cảnh báo.`,
    };
    return subjectPrompts[subject] || `Bạn là giáo viên lớp ${grade}.`;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const problemFiles = formData.getAll('problems') as File[];
        const solutionFiles = formData.getAll('solutions') as File[];
        const grade = formData.get('class') as string | null;
        const subject = formData.get('subject') as string | null;

        if (!problemFiles.length || !solutionFiles.length)
            return NextResponse.json({ message: 'Thiếu file đề hoặc bài làm.' }, { status: 400 });
        if (!grade || !subject)
            return NextResponse.json({ message: 'Thiếu lớp hoặc môn học.' }, { status: 400 });

        const getMimeType = (file: File) => {
            if (file.type && file.type !== 'application/octet-stream') return file.type;
            const ext = file.name.split('.').pop()?.toLowerCase();
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                case 'webp':
                    return 'image/webp';
                default:
                    return 'image/png';
            }
        };

        const problemData = await Promise.all(
            problemFiles.map(async (f) => ({
                name: f.name,
                data: Buffer.from(await f.arrayBuffer()).toString('base64'),
                mimeType: getMimeType(f),
            })),
        );

        const solutionData = await Promise.all(
            solutionFiles.map(async (f) => ({
                name: f.name,
                data: Buffer.from(await f.arrayBuffer()).toString('base64'),
                mimeType: getMimeType(f),
            })),
        );

        const problemList = problemData.map((f) => `- ${f.name}`).join('\n');
        const solutionList = solutionData.map((f) => `- ${f.name}`).join('\n');

        const textPrompt = `
            Bạn là giáo viên AI lớp ${grade}, môn ${subject}.
            ${getSubjectPrompt(subject, grade)}

            Nhiệm vụ:
            1️⃣ Đọc kỹ các file "Đề bài" và "Bài làm".
            2️⃣ Nếu hợp lệ, phân tích từng câu theo cấu trúc:
            {
            "questions": [
                {
                "id": 1,
                "question": "Tóm tắt nội dung đề bài 1",
                "aiAnswer": "Phân tích, ưu điểm, nhược điểm, lời khuyên",
                "type": "Trắc nghiệm"
                }
            ],
            "generalFeedback": "Nhận xét chung cho toàn bộ bài.",
            "examType": "Trắc nghiệm + Tự luận"
            }
            Hãy đảm bảo trả về **chuẩn JSON** và không có ký tự thừa.
            ĐỀ BÀI:[PAR]
            ${problemList.split('\n').join('[LINE]')}
            BÀI LÀM:[PAR]
            ${solutionList.split('\n').join('[LINE]')}
            `;

        const genAI = new GoogleGenerativeAI(env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const inputs = [
            {
                role: 'user',
                parts: [
                    { text: textPrompt },
                    ...problemData.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                    ...solutionData.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                ],
            },
        ];

        const result = await model.generateContent({ contents: inputs });
        const aiText = result.response.text();

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
