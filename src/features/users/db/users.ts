import { db } from '@/drizzle/db';
import { UserClassesTable, UserTable } from '@/drizzle/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getUserGlobalTag, revalidateUserCache } from './cache';
import { revalidateTag } from 'next/cache';

export async function getNextUserOrder(classId: string) {
    const lastUser = await db
        .select({ order: UserClassesTable.order })
        .from(UserClassesTable)
        .where(eq(UserClassesTable.classId, classId))
        .orderBy(desc(UserClassesTable.order))
        .limit(1);

    return lastUser[0] ? lastUser[0].order + 1 : 0;
}

export async function insertUser(data: typeof UserTable.$inferInsert) {
    await db.insert(UserTable).values(data).onDuplicateKeyUpdate({ set: data });

    const [newUser] = await db.select().from(UserTable).where(eq(UserTable.email, data.email));

    if (!newUser) throw new Error('Failed to create user');

    revalidateUserCache(newUser.id);

    return newUser;
}

export async function updateUser(
    { clerkUserId }: { clerkUserId: string },
    data: Partial<typeof UserTable.$inferInsert>,
) {
    await db.update(UserTable).set(data).where(eq(UserTable.clerkUserId, clerkUserId));

    const [updatedUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, clerkUserId));

    if (!updatedUser) throw new Error('Failed to update user');
    revalidateUserCache(updatedUser.id);
    return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
    const [userToDelete] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, clerkUserId));

    if (!userToDelete) {
        throw new Error('User not found in DB');
    }

    await db.delete(UserTable).where(eq(UserTable.clerkUserId, clerkUserId));
    revalidateTag(getUserGlobalTag());
    return userToDelete;
}

// export async function insertUser(data: typeof UserTable.$inferInsert) {
//     try {
//         await db.insert(UserTable).values(data).onDuplicateKeyUpdate({ set: data });

//         const [newUser] = await db
//             .select()
//             .from(UserTable)
//             .where(eq(UserTable.clerkUserId, data.clerkUserId));

//         if (!newUser) {
//             throw new Error('Failed to create user');
//         }
//         revalidateUserCache(newUser.id);

//         return newUser;
//     } catch (err) {
//         throw err;
//     }
// }

// export async function updateUser(
//     { clerkUserId }: { clerkUserId: string },
//     data: Partial<typeof UserTable.$inferInsert>,
// ) {
//     await db.update(UserTable).set(data).where(eq(UserTable.clerkUserId, clerkUserId));

//     const [updatedUser] = await db
//         .select()
//         .from(UserTable)
//         .where(eq(UserTable.clerkUserId, clerkUserId));

//     if (!updatedUser) throw new Error('Failed to update user');
//     revalidateUserCache(updatedUser.id);

//     return updatedUser;
// }

// export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
//     const timestamp = Date.now();
//     const deletedClerkId = `deleted_${timestamp}`;

//     try {
//         await db
//             .update(UserTable)
//             .set({
//                 deletedAt: new Date(),
//                 email: `deleted_${timestamp}@deleted.com`,
//                 name: `Deleted User ${timestamp}`,
//                 clerkUserId: deletedClerkId,
//                 imageUrl: null,
//             })
//             .where(eq(UserTable.clerkUserId, clerkUserId));

//         const [deletedUser] = await db
//             .select()
//             .from(UserTable)
//             .where(eq(UserTable.clerkUserId, deletedClerkId));

//         if (!deletedUser) {
//             throw new Error('Failed to retrieve deleted user');
//         }

//         revalidateUserCache(deletedUser.id);

//         return deletedUser;
//     } catch (err) {
//         console.error('❌ Error in deleteUser():', err);
//         throw err;
//     }
// }

export async function updateUserOrders(classId: string, userIds: string[]) {
    // Cập nhật order cho từng user trong lớp
    await Promise.all(
        userIds.map((userId, index) =>
            db
                .update(UserClassesTable)
                .set({ order: index })
                .where(
                    and(eq(UserClassesTable.userId, userId), eq(UserClassesTable.classId, classId)),
                ),
        ),
    );

    // Lấy lại các bản ghi vừa cập nhật
    const updatedUserClasses = await db
        .select({
            userId: UserClassesTable.userId,
            classId: UserClassesTable.classId,
        })
        .from(UserClassesTable)
        .where(
            and(eq(UserClassesTable.classId, classId), inArray(UserClassesTable.userId, userIds)),
        );

    // Revalidate cache cho từng user trong lớp
    updatedUserClasses.forEach(({ userId, classId }) => {
        revalidateUserCache(userId);
        // Nếu bạn có cache theo lớp, có thể gọi thêm:
        // revalidateClassCache(classId);
    });
}
