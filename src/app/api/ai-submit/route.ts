// src/app/api/ai-submit/route.ts
import { env } from '@/data/env/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

function getSubjectPrompt(subject: string, grade: string) {
    const subjectPrompts: Record<string, string> = {
        toan: `Bạn là giáo viên Toán lớp ${grade}. Tập trung trình bày rõ các bước giải, công thức, phương pháp. Nếu bài làm là hình không liên quan (nhân vật, phong cảnh, giấy trắng...) hãy cảnh báo học sinh gửi sai.`,
        van: `Bạn là giáo viên Ngữ Văn lớp ${grade}. Tập trung đọc chữ viết, phân tích câu, đoạn, ý chính. Nếu hình không chứa chữ viết hoặc không liên quan, hãy cảnh báo học sinh gửi sai.`,
        ly: `Bạn là giáo viên Lý lớp ${grade}. Chú ý các công thức, minh họa. Nếu hình không chứa nội dung bài học, hãy thông báo không hợp lệ.`,
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

        if (!problemFiles.length || !solutionFiles.length) {
            return NextResponse.json({ message: 'Thiếu file đề hoặc bài làm.' }, { status: 400 });
        }
        if (!grade || !subject) {
            return NextResponse.json({ message: 'Thiếu lớp hoặc môn học.' }, { status: 400 });
        }

        // --- Helper xác định mimeType ---
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

        // --- Chuyển file sang base64 + mimeType hợp lệ ---
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

        // --- Prompt text ---
        const textPrompt = `
            Bạn là giáo viên AI lớp ${grade}, môn ${subject}.
            ${getSubjectPrompt(subject, grade)}

            Nhiệm vụ:
            1️⃣ Đọc kỹ các hình ảnh "Đề bài" và "Bài làm".
            2️⃣ Nếu bài làm KHÔNG LIÊN QUAN, hãy cảnh báo học sinh gửi sai.
            3️⃣ Nếu hợp lệ, hãy:
            - Chấm điểm (0-10)
            - Phân tích ưu điểm
            - Phân tích nhược điểm
            - Đưa ra lời khuyên cải thiện

            Hãy **trả lời chia thành các đoạn rõ ràng**, sử dụng ký hiệu đặc biệt:
            [PAR] để bắt đầu đoạn mới
            [LINE] để xuống dòng trong đoạn

            ĐỀ BÀI:[PAR]
            ${problemList.split('\n').join('[LINE]')}

            BÀI LÀM:[PAR]
            ${solutionList.split('\n').join('[LINE]')}

            PHÂN TÍCH:[PAR]
            - Ưu điểm:[LINE]...
            - Nhược điểm:[LINE]...
            - Lời khuyên:[LINE]...
        `;

        // --- Khởi tạo model ---
        const genAI = new GoogleGenerativeAI(env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        // --- Tạo đầu vào đa phương tiện (text + ảnh) ---
        const inputs = [
            {
                role: 'user',
                parts: [
                    { text: textPrompt }, // phần text
                    // Đề bài
                    ...problemData.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                    // Bài làm
                    ...solutionData.map((f) => ({
                        inlineData: { data: f.data, mimeType: f.mimeType },
                    })),
                ],
            },
        ];

        // --- Gọi model ---
        const result = await model.generateContent({ contents: inputs });
        const text = result.response.text();

        return NextResponse.json(
            {
                text,
                meta: {
                    class: grade,
                    subject,
                    problems: problemFiles.map((f) => f.name),
                    solutions: solutionFiles.map((f) => f.name),
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('❌ Lỗi AI:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
