'use server';

import z from 'zod';
import { exerciseSchema } from '../schemas/exercises';
import { getCurrentUser } from '@/services/clerk';
import {
    canCreateExercises,
    canDeleteExercises,
    canUpdateExercises,
} from '../permissions/canCreateExercises';
import {
    deleteExercise,
    getNextExerciseOrder,
    insertExercisse,
    saveUserSubmission,
    updateExercise,
    updateExerciseOrders,
} from '../db/exercises';
import { db } from '@/drizzle/db';
import {
    ExerciseClassesTable,
    ExerciseProgressTable,
    ExercisesTable,
    ExerciseSubmissionsTable,
} from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { getClassroomIdTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '../db/cache';
import axios from 'axios';
import { typesenseClient } from '@/lib/typesense';
import { CollectionSchema } from 'typesense/lib/Typesense/Collection';

function normalizeString(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .trim();
}

export async function createExerciseAction(
    classIds: string[],
    unsafeData: z.infer<typeof exerciseSchema>,
    lang: 'vi' | 'en',
) {
    const { success, data } = exerciseSchema.safeParse(unsafeData);

    if (!success) {
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu bài tập không hợp lệ' : 'Invalid exercise data',
        };
    }

    const currentUser = await getCurrentUser();
    if (!canCreateExercises(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Bạn không có quyền làm việc này' : 'Unauthorized',
        };
    }

    let s3Key = '';
    if (data.file) {
        try {
            // 1. Gọi route API để lấy presigned URL
            const presignedResp = await axios.post('http://localhost:3000/api/s3/upload', {
                filename: data.file.name,
                contentType: data.file.type,
                size: data.file.size,
            });

            const { presignedUrl, key } = presignedResp.data;

            // 2. Upload file trực tiếp lên S3
            await axios.put(presignedUrl, data.file, {
                headers: { 'Content-Type': data.file.type },
            });

            // 3. Gán key trả về cho s3Key
            s3Key = key;
        } catch (err) {
            console.error(err);
            return {
                error: true,
                message: lang === 'vi' ? 'Upload file thất bại' : 'File upload failed',
            };
        }
    }

    const newExercise = await insertExercisse({
        name: data.name,
        description: data.description,
        subject: data.subjectName,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxScore: data.maxScore ?? null,
        s3Key,
    });

    for (const classId of classIds) {
        const order = await getNextExerciseOrder(classId);
        await db
            .insert(ExerciseClassesTable)
            .values({ exerciseId: newExercise.id, classId, order });
    }

    const exericseWithClasses = {
        ...newExercise,
        classes: await db
            .select({ classId: ExerciseClassesTable.classId, order: ExerciseClassesTable.order })
            .from(ExerciseClassesTable)
            .where(eq(ExerciseClassesTable.exerciseId, newExercise.id)),
    };

    try {
        // Kiểm tra collection
        const collections: CollectionSchema[] = await typesenseClient.collections().retrieve();
        const collectionExists = collections.some((c) => c.name === 'exercises');

        if (!collectionExists) {
            await typesenseClient.collections().create({
                name: 'exercises',
                fields: [
                    { name: 'id', type: 'string' },
                    { name: 'name', type: 'string' },
                    { name: 'name_normalized', type: 'string' },
                ],
            });
        }

        // Thêm document
        await typesenseClient
            .collections('exercises')
            .documents()
            .create({
                id: newExercise.id,
                name: newExercise.name,
                name_normalized: normalizeString(newExercise.name),
            });
    } catch (err) {
        console.error('Typesense indexing failed on create:', err);
    }

    return {
        error: false,
        message: lang === 'vi' ? 'Tạo bài tập thành công' : 'Successfully created exercise',
        data: exericseWithClasses,
    };
}

export async function updateExerciseAction(
    id: string,
    unsafeData: z.infer<typeof exerciseSchema>,
    lang: 'vi' | 'en',
) {
    const { success, data } = exerciseSchema.safeParse(unsafeData);
    if (!success)
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu không hợp lệ' : 'Invalid exercise data',
        };

    const currentUser = await getCurrentUser();
    if (!canUpdateExercises(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền chỉnh sửa' : 'Unauthorized',
        };
    }

    const [existingExercise] = await db
        .select()
        .from(ExercisesTable)
        .where(eq(ExercisesTable.id, id));

    if (!existingExercise) {
        return {
            error: true,
            message: lang === 'vi' ? 'Bài tập không tồn tại' : 'Exercise not found',
        };
    }

    let s3Key = existingExercise.s3Key || '';

    if (data.file) {
        try {
            // 🔹 Nếu đã có file cũ trên S3, xóa trước khi upload mới
            if (s3Key) {
                await axios.delete('http://localhost:3000/api/s3/delete', {
                    data: { key: s3Key },
                });
            }

            // 🔹 Upload file mới lên S3
            const presignedResp = await axios.post('http://localhost:3000/api/s3/upload', {
                filename: data.file.name,
                contentType: data.file.type,
                size: data.file.size,
            });

            const { presignedUrl, key } = presignedResp.data;

            await axios.put(presignedUrl, data.file, {
                headers: { 'Content-Type': data.file.type },
            });

            s3Key = key;
        } catch (err) {
            console.error('S3 upload/delete error:', err);
            return {
                error: true,
                message: lang === 'vi' ? 'Upload file thất bại' : 'File upload failed',
            };
        }
    }

    const formattedData = {
        name: data.name,
        description: data.description,
        subject: data.subjectName,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxScore: data.maxScore ?? null,
        s3Key,
    };

    const updatedExercise = await updateExercise({ id }, formattedData);

    // 🔹 Cập nhật lớp cho user
    if (data.classroomIds) {
        // 1️⃣ Xóa các lớp cũ
        await db
            .delete(ExerciseClassesTable)
            .where(eq(ExerciseClassesTable.exerciseId, updatedExercise.id));

        // 2️⃣ Thêm các lớp mới
        for (const classId of data.classroomIds) {
            const order = await getNextExerciseOrder(classId);
            await db
                .insert(ExerciseClassesTable)
                .values({ exerciseId: updatedExercise.id, classId, order });
        }
    }

    try {
        await typesenseClient
            .collections('exercises')
            .documents(id)
            .update({
                name: updatedExercise.name,
                name_normalized: normalizeString(updatedExercise.name),
                description: updatedExercise.description,
            });
    } catch (err) {
        console.error('Typesense indexing failed on update:', err);
    }

    return {
        error: false,
        message: lang === 'vi' ? 'Cập nhật bài tập thành công' : 'Successfully updated exercise',
        data: updatedExercise,
    };
}

export async function deleteExerciseAction(id: string, lang: 'vi' | 'en') {
    const currentUser = await getCurrentUser();
    if (!canDeleteExercises(currentUser)) {
        return { error: true, message: 'Unauthorized to delete user' };
    }

    try {
        // 1️⃣ Lấy thông tin bài tập trước để lấy s3Key
        const [exerciseToDelete] = await db
            .select()
            .from(ExercisesTable)
            .where(eq(ExercisesTable.id, id));

        if (!exerciseToDelete) {
            return {
                error: true,
                message: lang === 'vi' ? 'Bài tập không tồn tại' : 'Exercise not found in DB',
            };
        }

        // 2️⃣ Xóa file trên S3 nếu có
        if (exerciseToDelete.s3Key) {
            await axios.delete('http://localhost:3000/api/s3/delete', {
                data: { key: exerciseToDelete.s3Key },
            });
        }

        // 3️⃣ Xóa bài tập ở DB bằng hàm sẵn có
        await deleteExercise({ id });

        // 4️⃣ Xóa các lớp liên quan nếu cần
        await db.delete(ExerciseClassesTable).where(eq(ExerciseClassesTable.exerciseId, id));

        // 5️⃣ Revalidate cache cho lớp nếu cần
        const exerciseClass = await db
            .select()
            .from(ExerciseClassesTable)
            .where(eq(ExerciseClassesTable.exerciseId, id))
            .limit(1);
        const classroomId = exerciseClass?.[0]?.classId;

        revalidateTag(getExerciseGlobalTag());
        if (classroomId) revalidateTag(getClassroomIdTag(classroomId));

        try {
            await typesenseClient.collections('exercises').documents(id).delete();
        } catch (err) {
            console.error('Typesense delete failed:', err);
        }

        return {
            error: false,
            message: lang === 'vi' ? 'Xóa bài tập thành công' : 'Successfully deleted exercise',
        };
    } catch (err) {
        console.error('Delete exercise error:', err);
        return {
            error: true,
            message: lang === 'vi' ? 'Xóa bài tập thất bại' : 'Failed to delete exercise',
        };
    }
}

export async function updateExerciseOrdersAction(classId: string, exerciseIds: string[]) {
    if (exerciseIds.length === 0 || !canUpdateExercises(await getCurrentUser())) {
        return { error: true, message: 'Error reordering exercises' };
    }

    await updateExerciseOrders(classId, exerciseIds);

    return { error: false, message: 'Successfully reordered exercises' };
}

export async function viewFileExerciseAction(exerciseId: string, lang?: 'vi' | 'en') {
    try {
        const [existingExercise] = await db
            .select()
            .from(ExercisesTable)
            .where(eq(ExercisesTable.id, exerciseId));

        if (!existingExercise) {
            return {
                error: true,
                message: lang === 'vi' ? 'Bài tập không tồn tại' : 'Exercise not found in DB',
            };
        }
        if (!existingExercise) {
            return {
                error: true,
                message: lang === 'vi' ? 'Bài tập không tồn tại' : 'Exercise not found in DB',
            };
        }

        const key = existingExercise.s3Key;
        if (!key) {
            return {
                error: true,
                message:
                    lang === 'vi' ? 'Bài tập chưa có file' : 'No file available for this exercise',
            };
        }

        const response = await axios.post('http://localhost:3000/api/s3/get-file', { key });
        const data = response.data;
        console.log(data.url);

        if (data.url) {
            return {
                error: false,
                message: lang === 'vi' ? 'Đang mở file bài tập...' : 'Opening exercise file...',
                url: data.url,
            };
        } else {
            return {
                error: true,
                message:
                    lang === 'vi'
                        ? 'Có lỗi khi mở file bài tập'
                        : 'There was an error opening the file',
            };
        }
    } catch (e) {
        console.error(e);
        return {
            error: true,
            message: lang === 'vi' ? 'Xem bài tập thất bại' : 'Failed to view exercise',
        };
    }
}

interface PresignedUrlResponse {
    presignedUrl: string;
    key: string;
    submissionId: string; // Đảm bảo TypeScript biết đây là string
}
export async function saveUserSubmissionAction(
    exerciseId: string,
    aiResult: JSON,
    files: File[],
    lang?: 'vi' | 'en',
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return { error: true, message: 'Unauthorized' };
        }

        let currentSubmissionId: string | undefined = undefined;

        // ❗ Mảng lưu s3Key + fileType
        const uploadedFiles: { s3Key: string; fileType: string }[] = [];

        for (const file of files) {
            // 1️⃣ Gọi API route để lấy presigned URL
            const presignedResp = await axios.post('http://localhost:3000/api/s3/user/upload', {
                filename: file.name,
                contentType: file.type,
                size: file.size,
                exerciseId: exerciseId,
                userId: currentUser.userId,
                submissionId: currentSubmissionId,
            });

            // 🚨 SỬA 3: Lấy cả 'submissionId' từ response
            const { presignedUrl, key, submissionId } = presignedResp.data as PresignedUrlResponse;

            // 🚨 SỬA 4: CẬP NHẬT submissionId để sử dụng cho file tiếp theo
            // Lần 1: Nhận ID mới từ Server. Lần 2+: Nhận lại ID cũ đã gửi.
            currentSubmissionId = submissionId;

            // 2️⃣ Upload file trực tiếp lên S3
            await axios.put(presignedUrl, file, { headers: { 'Content-Type': file.type } });

            // 3️⃣ Lưu s3Key + fileType vào mảng
            uploadedFiles.push({ s3Key: key, fileType: file.type });
        }

        // ❗ Lưu submission vào DB
        const submission = await saveUserSubmission({
            exerciseId,
            userId: currentUser.userId!,
            aiResult,
            files: uploadedFiles,
        });

        return {
            error: false,
            message: lang === 'vi' ? 'Nộp bài thành công' : 'Submission saved',
            data: submission,
        };
    } catch (err) {
        console.error(err);
        return {
            error: true,
            message: lang === 'vi' ? 'Lưu dữ liệu thất bại' : 'Failed to save',
        };
    }
}

export async function getLatestSubmissionAction(exerciseId: string, userId?: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.userId) {
        throw new Error('Unauthorized');
    }

    let selectedUserId;
    if (userId == null) {
        selectedUserId = currentUser.userId;
    } else {
        selectedUserId = userId;
    }

    try {
        // 1. Truy vấn bài nộp mới nhất
        const latestSubmissions = await db
            .select({
                aiResult: ExerciseSubmissionsTable.aiResultJson, // Chỉ chọn trường aiResult
            })
            .from(ExerciseSubmissionsTable)
            .where(
                // 🚨 SỬA LỖI CÚ PHÁP: Kết hợp hai điều kiện bằng hàm 'and()'
                and(
                    eq(ExerciseSubmissionsTable.exerciseId, exerciseId),
                    eq(ExerciseSubmissionsTable.userId, selectedUserId),
                ),
            )
            .orderBy(desc(ExerciseSubmissionsTable.createdAt)) // Sắp xếp theo thời gian mới nhất
            .limit(1);

        // 2. Lấy kết quả đầu tiên (tương đương với MySQL LIMIT 1)
        const latestSubmission = latestSubmissions[0];

        // 3. Trả về trường JSON kết quả AI
        if (latestSubmission && latestSubmission.aiResult) {
            return latestSubmission.aiResult;
        }

        return null; // Không có bài nộp nào
    } catch (error) {
        console.error('Error fetching latest submission:', error);
        return null;
    }
}
