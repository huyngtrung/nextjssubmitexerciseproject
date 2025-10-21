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
    getNextExerciseOrder,
    insertExercisse,
    updateExercise,
    updateExerciseOrders,
} from '../db/exercises';
import { db } from '@/drizzle/db';
import { ExerciseClassesTable, ExercisesTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { getClassroomIdTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '../db/cache';

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

    const newExercise = await insertExercisse({
        name: data.name,
        description: data.description,
        subject: data.subjectName,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxScore: data.maxScore ?? null,
    });

    // 4️⃣ Nếu có classId → gán vào bảng trung gian
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

    const formattedData = {
        name: data.name,
        description: data.description,
        subject: data.subjectName,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxScore: data.maxScore ?? null,
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

    const [exerciseToDelete] = await db
        .select()
        .from(ExercisesTable)
        .where(eq(ExercisesTable.id, id));

    if (!exerciseToDelete) {
        return { error: true, message: 'exercise not found in DB' };
    }

    // 2️⃣ Lấy classroomId nếu user thuộc lớp
    const exerciseClass = await db
        .select()
        .from(ExerciseClassesTable)
        .where(eq(ExerciseClassesTable.exerciseId, exerciseToDelete.id))
        .limit(1);

    const classroomId = exerciseClass?.[0]?.classId;

    await db.delete(ExercisesTable).where(eq(ExercisesTable.id, id));

    // 5️⃣ Revalidate cache
    revalidateTag(getExerciseGlobalTag());
    if (classroomId) revalidateTag(getClassroomIdTag(classroomId));

    return {
        error: false,
        message: lang === 'vi' ? 'Xóa bài tập thành công' : 'Successfully deleted exercise',
    };
}

// 🔹 Cập nhật thứ tự user trong lớp
export async function updateExerciseOrdersAction(classId: string, exerciseIds: string[]) {
    if (exerciseIds.length === 0 || !canUpdateExercises(await getCurrentUser())) {
        return { error: true, message: 'Error reordering exercises' };
    }

    await updateExerciseOrders(classId, exerciseIds);

    return { error: false, message: 'Successfully reordered exercises' };
}
