'use server';

import { eq } from 'drizzle-orm';
import z from 'zod';
import { classSchema } from '../schemas/classrooms';
import { getCurrentUser } from '@/services/clerk';
import {
    canCreateClassrooms,
    canDeleteClassrooms,
    canUpdateClassrooms,
} from '../permissions/canCreateClassrooms';
import {
    deleteclassroom as deleteclassroomdb,
    getNextClassroomOrder,
    insertClass,
    updateClassDb,
} from '../db/classrooms';
import { db } from '@/drizzle/db';
import { ClassesTable } from '@/drizzle/schema';

export async function createClassroom(lang: 'vi' | 'en', unsafeData: z.infer<typeof classSchema>) {
    const { success, data } = classSchema.safeParse(unsafeData);

    if (!success) {
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu người dùng không hợp lệ' : 'Invalid user data',
        };
    }

    const currentUser = await getCurrentUser();
    if (!canCreateClassrooms(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền chỉnh sửa' : 'Unauthorized',
        };
    }
    const order = await getNextClassroomOrder();

    const classroom = await insertClass({ ...data, order });

    return {
        error: false,
        message: lang === 'vi' ? 'Tạo lớp học thành công' : 'Successfully created classroom',
    };
}

export async function updateClassroom(
    id: string,
    lang: 'vi' | 'en',
    unsafeData: z.infer<typeof classSchema>,
) {
    const { success, data } = classSchema.safeParse(unsafeData);

    if (!success) {
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu người dùng không hợp lệ' : 'Invalid user data',
        };
    }

    const currentUser = await getCurrentUser();
    if (!canUpdateClassrooms(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền chỉnh sửa' : 'Unauthorized',
        };
    }

    const [currentClass] = await db.select().from(ClassesTable).where(eq(ClassesTable.id, id));

    if (!currentClass) return { error: true, message: 'Class not found' };

    await updateClassDb(id, { ...data, order: currentClass.order });

    return {
        error: false,
        message: lang === 'vi' ? 'Sửa lớp học thành công' : 'Successfully updated classroom',
    };
}

export async function deleteclassroom(id: string, lang: 'vi' | 'en') {
    if (!canDeleteClassrooms(await getCurrentUser())) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền xóa' : 'Unauthorized',
        };
    }

    await deleteclassroomdb(id);

    return {
        error: false,
        message: lang === 'vi' ? 'Xóa lớp học thành công' : 'Successfully deleted classroom',
    };
}
