import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { s3Client } from '@/lib/s3Client';
import { eq } from 'drizzle-orm';
import { ExercisesTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { env } from '@/data/env/client';

// --- TYPE DEFINITIONS ---

/**
 * Định nghĩa cấu trúc dữ liệu file đã xử lý cho Gemini API.
 */
interface ExerciseFile {
    name: string;
    data: string; // Base64 string
    mimeType: string;
}

// --- HÀM PHỤ TRỢ (Giữ nguyên) ---

/**
 * Chuyển đổi Readable Stream (từ S3 Body) sang Buffer.
 */
async function streamToBuffer(stream: Readable | undefined): Promise<Buffer> {
    if (!stream) return Buffer.from('');
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * Lấy MIME Type dựa trên ContentType từ S3 hoặc đuôi mở rộng.
 */
function getMimeTypeFromFileName(fileName: string, contentType?: string): string {
    if (contentType && contentType !== 'application/octet-stream') {
        return contentType;
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'pdf':
            return 'application/pdf';
        default:
            return 'application/octet-stream';
    }
}

// --- HÀM CHÍNH: DATA ACCESS LAYER ---

/**
 * Lấy thông tin bài tập (s3Key từ DB) và tải file gốc từ S3, sau đó chuyển sang Base64.
 * @param exerciseId ID của bài tập cần chấm.
 * @returns Object chứa file đề bài ở dạng Base64, hoặc null nếu có lỗi/không tìm thấy.
 */
export async function getExerciseDataById(
    exerciseId: string,
): Promise<{ fileData: ExerciseFile[] } | null> {
    let s3Key: string | undefined;
    let s3FileName: string | undefined;

    try {
        // 🚀 BƯỚC 1: TRUY VẤN DATABASE (Sử dụng MySQL/Drizzle ORM)
        const exerciseRecord = await db
            .select({
                s3Key: ExercisesTable.s3Key, // Giả định cột s3Key
                name: ExercisesTable.name, // Giả định cột name để lấy tên file
            })
            .from(ExercisesTable)
            .where(eq(ExercisesTable.id, exerciseId))
            .limit(1);

        const record = exerciseRecord[0];

        if (!record || !record.s3Key) {
            console.warn(`Không tìm thấy Bài tập hoặc S3 Key cho Exercise ID: ${exerciseId}`);
            return null;
        }

        s3Key = record.s3Key;
        s3FileName = record.name;

        // 🚀 BƯỚC 2: TẢI FILE TỪ S3
        const command = new GetObjectCommand({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME, // ⚠️ Cần đảm bảo đây là biến env server side
            Key: s3Key,
        });

        const response = await s3Client.send(command);

        if (!response.Body) {
            console.error(`S3 Key ${s3Key} không có dữ liệu (Body).`);
            return null;
        }

        // 🚀 BƯỚC 3: XỬ LÝ DỮ LIỆU VÀ TRẢ VỀ CHO AI
        const fileBuffer = await streamToBuffer(response.Body as Readable);

        // Lấy tên file chính xác từ DB, nếu không có thì dùng S3 Key
        const fileName = s3FileName || s3Key.split('/').pop() || 'problem_file';
        const mimeType = getMimeTypeFromFileName(fileName, response.ContentType);

        return {
            fileData: [
                {
                    name: fileName,
                    data: fileBuffer.toString('base64'), // Mã hóa Base64
                    mimeType: mimeType,
                },
            ],
        };
    } catch {
        return null;
    }
}
