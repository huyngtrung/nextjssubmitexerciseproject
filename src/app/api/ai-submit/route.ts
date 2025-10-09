// src/app/api/ai-submit/route.ts
import { env } from '@/data/env/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Lấy FormData từ request
        const formData = await request.formData();
        const problemFile = formData.get('problem') as File | null;
        const solutionFile = formData.get('solution') as File | null;

        if (!problemFile || !solutionFile) {
            return NextResponse.json({ message: 'Vui lòng gửi đủ 2 file' }, { status: 400 });
        }

        // Tạo prompt theo cú pháp bạn muốn
        const prompt = `
            Bạn là giáo viên ảo.
            Bài mẫu: ${problemFile.name}
            Bài làm học sinh: ${solutionFile.name}
            Hãy nhận xét chi tiết: đúng/sai, gợi ý cải thiện và hướng dẫn học sinh.
            `;

        // Khởi tạo Gemini client
        const genAI = new GoogleGenerativeAI(env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Gọi model với prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // response.text() là async

        return NextResponse.json({ text }, { status: 200 });
    } catch (error) {
        console.error('Error generating content:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
