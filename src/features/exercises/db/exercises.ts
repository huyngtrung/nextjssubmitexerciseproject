import { db } from '@/drizzle/db';
import { ExerciseClassesTable, ExercisesTable, UserClassesTable } from '@/drizzle/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getExerciseGlobalTag, revalidateExerciseCache } from './cache';
import { revalidateTag } from 'next/cache';

export async function getNextExerciseOrder(classId: string) {
    const lastExercise = await db
        .select({ order: ExerciseClassesTable.order })
        .from(ExerciseClassesTable)
        .where(eq(ExerciseClassesTable.classId, classId))
        .orderBy(desc(ExerciseClassesTable.order))
        .limit(1);

    return lastExercise[0] ? lastExercise[0].order + 1 : 0;
}

export async function insertExercisse(data: typeof ExercisesTable.$inferInsert) {
    await db.insert(ExercisesTable).values(data).onDuplicateKeyUpdate({ set: data });

    const [newExercise] = await db
        .select()
        .from(ExercisesTable)
        .where(eq(ExercisesTable.name, data.name));

    if (!newExercise) throw new Error('Failed to create exercise');

    revalidateExerciseCache(newExercise.id);

    return newExercise;
}

export async function updateExercise(
    { id }: { id: string },
    data: Partial<typeof ExercisesTable.$inferInsert>,
) {
    await db.update(ExercisesTable).set(data).where(eq(ExercisesTable.id, id));

    const [updatedExercise] = await db
        .select()
        .from(ExercisesTable)
        .where(eq(ExercisesTable.id, id));

    if (!updatedExercise) throw new Error('Failed to update exercise');
    revalidateExerciseCache(updatedExercise.id);
    return updatedExercise;
}

export async function deleteExercise({ id }: { id: string }) {
    const [exerciseToDelete] = await db
        .select()
        .from(ExercisesTable)
        .where(eq(ExercisesTable.id, id));

    if (!exerciseToDelete) {
        throw new Error('exercise not found in DB');
    }

    await db.delete(ExercisesTable).where(eq(ExercisesTable.id, id));
    revalidateTag(getExerciseGlobalTag());
    return exerciseToDelete;
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

export async function updateExerciseOrders(classId: string, exerciseIds: string[]) {
    // Cập nhật order cho từng user trong lớp
    await Promise.all(
        exerciseIds.map((exerciseId, index) =>
            db
                .update(ExerciseClassesTable)
                .set({ order: index })
                .where(
                    and(
                        eq(ExerciseClassesTable.exerciseId, exerciseId),
                        eq(ExerciseClassesTable.classId, classId),
                    ),
                ),
        ),
    );

    // Lấy lại các bản ghi vừa cập nhật
    const updatedExerciseClasses = await db
        .select({
            exerciseId: ExerciseClassesTable.exerciseId,
            classId: UserClassesTable.classId,
        })
        .from(ExerciseClassesTable)
        .where(
            and(
                eq(ExerciseClassesTable.classId, classId),
                inArray(ExerciseClassesTable.exerciseId, exerciseIds),
            ),
        );

    // Revalidate cache cho từng user trong lớp
    updatedExerciseClasses.forEach(({ exerciseId, classId }) => {
        revalidateExerciseCache(exerciseId);
        // Nếu bạn có cache theo lớp, có thể gọi thêm:
        // revalidateClassCache(classId);
    });
}
