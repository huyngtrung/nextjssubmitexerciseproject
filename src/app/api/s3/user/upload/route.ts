import { NextResponse } from 'next/server';
import { PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { env } from '@/data/env/client';
import { s3Client } from '@/lib/s3Client';
import { v4 as uuidv4 } from 'uuid';

// Giới hạn số lần nộp cần giữ lại
const MAX_SUBMISSIONS_TO_KEEP = 2;

// Định nghĩa Schema Validation
const uploadRequestSchema = z.object({
    filename: z.string().min(1, 'Filename is required'),
    contentType: z.string().min(1, 'ContentType is required'),
    size: z.number().int().positive('Size must be a positive integer'),
    exerciseId: z.string().min(1, 'Exercise ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    submissionId: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = uploadRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validation.error.issues },
                { status: 400 },
            );
        }

        const {
            filename,
            contentType,
            size,
            exerciseId,
            userId,
            submissionId: clientSubmissionId,
        } = validation.data;

        let currentSubmissionId: string;

        // 🚨 SỬA 2: LOGIC XÁC ĐỊNH ID: Ưu tiên dùng ID của client
        if (clientSubmissionId) {
            // Nếu client gửi ID, sử dụng nó (để nhóm các file)
            currentSubmissionId = clientSubmissionId;
        } else {
            // Nếu KHÔNG có ID, tạo ID mới (cho lần nộp đầu tiên)
            const timestamp = Date.now();
            currentSubmissionId = `${timestamp}_${uuidv4()}`;
        }

        // Tiền tố cơ sở cho tất cả submissions của người dùng và bài tập này
        const basePrefix = `submissions/${userId}/${exerciseId}/`;

        // 2. Liệt kê TẤT CẢ các files (keys) đã tồn tại trong S3
        // KHÔNG dùng Delimiter để đảm bảo lấy tất cả keys
        const listAllCommand = new ListObjectsV2Command({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
            Prefix: basePrefix,
        });

        const listAllResult = await s3Client.send(listAllCommand);

        const uniqueSubmissionIds = new Set<string>();
        uniqueSubmissionIds.add(currentSubmissionId);

        // Trích xuất các submissionId đã tồn tại từ Keys (submissions/u/e/submissionId/file.txt)
        if (listAllResult.Contents) {
            for (const obj of listAllResult.Contents) {
                if (obj.Key) {
                    // Cắt bỏ basePrefix và lấy phần đầu tiên (submissionId)
                    const keySuffix = obj.Key.slice(basePrefix.length);
                    const parts = keySuffix.split('/');
                    if (parts.length > 0 && typeof parts[0] === 'string') {
                        uniqueSubmissionIds.add(parts[0]);
                    }
                }
            }
        }

        // 3. Sắp xếp và Xác định các Submission cần xóa

        const submissionPrefixes = Array.from(uniqueSubmissionIds);

        // Sắp xếp TĂNG DẦN theo thời gian (cũ nhất ở đầu mảng)
        submissionPrefixes.sort((a, b) => {
            const timeA = parseInt(a.split('_')[0] || '0');
            const timeB = parseInt(b.split('_')[0] || '0');
            return timeA - timeB; // Cũ -> Mới
        });

        if (submissionPrefixes.length > MAX_SUBMISSIONS_TO_KEEP) {
            const numToDelete = submissionPrefixes.length - MAX_SUBMISSIONS_TO_KEEP;
            // Lấy ra các ID cũ nhất cần xóa (numToDelete phần tử đầu tiên)
            const submissionsToDelete = submissionPrefixes.slice(0, numToDelete);

            // 4. Xóa các Submission cũ không cần thiết
            for (const oldSubmissionId of submissionsToDelete) {
                const oldPrefix = `${basePrefix}${oldSubmissionId}/`;

                // Liệt kê TẤT CẢ files trong submission cũ để xóa
                const oldFilesList = await s3Client.send(
                    new ListObjectsV2Command({
                        Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
                        Prefix: oldPrefix,
                    }),
                );

                if (oldFilesList.Contents) {
                    // Tạo mảng đối tượng Key để thực hiện lệnh xóa
                    const deleteObjects = oldFilesList.Contents.filter(
                        (obj): obj is { Key: string } => typeof obj.Key === 'string',
                    ).map((obj) => ({
                        Key: obj.Key,
                    }));

                    if (deleteObjects.length > 0) {
                        await s3Client.send(
                            new DeleteObjectsCommand({
                                Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
                                Delete: { Objects: deleteObjects },
                            }),
                        );
                        console.log(
                            `Deleted submission: ${oldSubmissionId} with ${deleteObjects.length} files.`,
                        );
                    }
                }
            }
        }

        // 5. Tạo key S3 và Presigned URL cho file mới
        const s3Key = `${basePrefix}${currentSubmissionId}/${filename}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
            Key: s3Key,
            ContentType: contentType,
            ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 360, // Hết hạn sau 360 giây (6 phút)
        });

        // 6. Trả về thông tin cho client
        return NextResponse.json({
            presignedUrl,
            key: s3Key,
            submissionId: currentSubmissionId, // Client cần submissionId để upload các files tiếp theo cho lần nộp này
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }
}
