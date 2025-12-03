'use server';

import z from 'zod';
import { userSchema } from '../schemas/users';
import { getCurrentUser } from '@/services/clerk';
import { canCreateUsers, canDeleteUsers, canUpdateUsers } from '../permissions/canCreateUsers';
import { getNextUserOrder, insertUser, updateUser, updateUserOrders } from '../db/users';
import { db } from '@/drizzle/db';
import { UserClassesTable, UserTable } from '@/drizzle/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { getUserGlobalTag } from '../db/cache';
import { getClassroomIdTag } from '@/features/classrooms/db/cache/classrooms';
import { typesenseClient } from '@/lib/typesense';
import { CollectionSchema } from 'typesense/lib/Typesense/Collection';

function normalizeString(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export async function createUser(
    classIds: string[],
    unsafeData: z.infer<typeof userSchema>,
    lang: 'vi' | 'en',
) {
    const { success, data } = userSchema.safeParse(unsafeData);

    if (!success) {
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu người dùng không hợp lệ' : 'Invalid user data',
        };
    }
    const currentUser = await getCurrentUser();
    if (!canCreateUsers(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền chỉnh sửa' : 'Unauthorized',
        };
    }

    try {
        // 1️⃣ Insert user vào DB trước để có id
        const newUser = await insertUser({
            clerkUserId: '',
            email: data.email,
            name: data.name,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            imageUrl: null,
        });

        // 2️⃣ Tạo user trong Clerk với dbId lấy từ newUser.id
        const client = await clerkClient();
        const clerkUser = await client.users.createUser({
            emailAddress: [data.email],
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.name,
            publicMetadata: {
                dbId: newUser.id,
                role: data.role,
            },
        });

        await db
            .update(UserTable)
            .set({ clerkUserId: clerkUser.id })
            .where(eq(UserTable.id, newUser.id));

        if (!newUser.id) throw new Error('User ID is missing, cannot assign classes');

        for (const classId of classIds) {
            const order = await getNextUserOrder(classId);
            await db.insert(UserClassesTable).values({ userId: newUser.id, classId, order });
        }

        const userWithClasses = {
            ...newUser,
            classes: await db
                .select({ classId: UserClassesTable.classId, order: UserClassesTable.order })
                .from(UserClassesTable)
                .where(eq(UserClassesTable.userId, newUser.id)),
        };

        try {
            // Kiểm tra collection
            const collections: CollectionSchema[] = await typesenseClient.collections().retrieve();
            const collectionExists = collections.some((c) => c.name === 'students');

            if (!collectionExists) {
                await typesenseClient.collections().create({
                    name: 'students',
                    fields: [
                        { name: 'id', type: 'string' },
                        { name: 'name', type: 'string' },
                        { name: 'name_normalized', type: 'string' },
                    ],
                });
            }

            // Thêm document
            await typesenseClient.collections('students').documents().create({
                clerkUserId: clerkUser.id,
                id: newUser.id,
                name: newUser.name,
            });
        } catch (err) {
            console.error('Typesense indexing failed on create:', err);
        }

        return {
            error: false,
            message: lang === 'vi' ? 'Tạo học sinh thành công' : 'Successfully created user',
            data: userWithClasses,
        };
    } catch (error) {
        console.error('❌ createUser failed:', error);
        return {
            error: true,
            message: lang === 'vi' ? 'Tạo học sinh thất bại' : 'Can not created user',
        };
    }
}

export async function updateUserAction(
    clerkUserId: string,
    unsafeData: z.infer<typeof userSchema>,
    lang: 'vi' | 'en',
) {
    const { success, data } = userSchema.safeParse(unsafeData);
    if (!success)
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu Người dùng không hợp lệ' : 'Invalid exercise data',
        };

    const currentUser = await getCurrentUser();
    if (!canUpdateUsers(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không có quyền chỉnh sửa' : 'Unauthorized',
        };
    }

    try {
        const updatedUser = await updateUser({ clerkUserId }, data);

        if (updatedUser.clerkUserId) {
            const client = await clerkClient();
            await client.users.updateUser(updatedUser.clerkUserId, {
                firstName: data.firstName ?? undefined,
                lastName: data.lastName ?? undefined,
                username: data.name ?? updatedUser.name,
                publicMetadata: {
                    role: data.role,
                    dbId: updatedUser.id,
                },
            });
        }

        // 🔹 Cập nhật lớp cho user
        if (data.classroomIds) {
            // 1️⃣ Xóa các lớp cũ
            await db.delete(UserClassesTable).where(eq(UserClassesTable.userId, updatedUser.id));

            // 2️⃣ Thêm các lớp mới
            for (const classId of data.classroomIds) {
                const order = await getNextUserOrder(classId);
                await db
                    .insert(UserClassesTable)
                    .values({ userId: updatedUser.id, classId, order });
            }
        }

        try {
            await typesenseClient
                .collections('students')
                .documents(clerkUserId)
                .update({
                    name: updatedUser.name,
                    name_normalized: normalizeString(updatedUser.name as string),
                });
        } catch (err) {
            console.error('Typesense indexing failed on update:', err);
        }

        return {
            error: false,
            message: lang === 'vi' ? 'Cập nhật học sinh thành công' : 'Sucessfully updated user',
            data: updatedUser,
        };
    } catch (error) {
        console.error('❌ updateUserAction failed:', error);
        return {
            error: true,
            message: lang === 'vi' ? 'Cập nhật học sinh thất bại' : 'Can not updated user',
        };
    }
}

// 🔹 Xóa user
export async function deleteUserAction(clerkUserId: string, lang: 'vi' | 'en') {
    const currentUser = await getCurrentUser();
    if (!canDeleteUsers(currentUser)) {
        return {
            error: true,
            message: lang === 'vi' ? 'Dữ liệu người dùng không hợp lệ' : 'Invalid exercise data',
        };
    }

    // 1️⃣ Lấy user từ DB trước
    const [userToDelete] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, clerkUserId));

    if (!userToDelete) {
        return {
            error: true,
            message: lang === 'vi' ? 'Không tìm thấy dữ liệu người dùng' : 'User not found in DB',
        };
    }

    // 2️⃣ Lấy tất cả lớp mà user tham gia
    const userClasses = await db
        .select({ classId: UserClassesTable.classId })
        .from(UserClassesTable)
        .where(eq(UserClassesTable.userId, userToDelete.id));

    try {
        // 3️⃣ Xóa user khỏi Clerk
        const client = await clerkClient();
        await client.users.deleteUser(clerkUserId);

        // 4️⃣ Xóa tất cả bản ghi trong bảng trung gian
        await db.delete(UserClassesTable).where(eq(UserClassesTable.userId, userToDelete.id));

        // 5️⃣ Xóa user khỏi DB
        await db.delete(UserTable).where(eq(UserTable.clerkUserId, clerkUserId));

        // 6️⃣ Revalidate cache cho user và tất cả lớp liên quan
        revalidateTag(getUserGlobalTag());
        userClasses.forEach(({ classId }) => revalidateTag(getClassroomIdTag(classId)));

        try {
            await typesenseClient.collections('students').documents(clerkUserId).delete();
        } catch (err) {
            console.error('Typesense delete failed:', err);
        }

        return {
            error: false,
            message: lang === 'vi' ? 'Xóa học sinh Thành công' : 'Can not delete user',
            data: userToDelete,
        };
    } catch (err) {
        console.error('❌ deleteUserAction failed:', err);
        return {
            error: true,
            message: lang === 'vi' ? 'Xóa học sinh thất bại' : 'Can not delete user',
        };
    }
}

// 🔹 Cập nhật thứ tự user trong lớp
export async function updateUserOrdersAction(classId: string, userIds: string[]) {
    if (userIds.length === 0 || !canUpdateUsers(await getCurrentUser())) {
        return { error: true, message: 'Error reordering users' };
    }

    await updateUserOrders(classId, userIds);

    return { error: false, message: 'Successfully reordered users' };
}
