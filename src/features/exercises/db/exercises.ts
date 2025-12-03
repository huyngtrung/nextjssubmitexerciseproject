import { db } from '@/drizzle/db';
import {
    ExerciseClassesTable,
    ExerciseProgressTable,
    ExercisesTable,
    ExerciseSubmissionsTable,
    SubmissionFilesTable,
    UserClassesTable,
} from '@/drizzle/schema';
import { and, desc, eq, inArray, asc } from 'drizzle-orm';
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

const MAX_SUBMISSIONS_TO_KEEP = 2;
export async function saveUserSubmission({
    exerciseId,
    userId,
    aiResult,
    files,
}: {
    exerciseId: string;
    userId: string;
    aiResult: JSON;
    files: { s3Key: string; fileType: string }[];
}) {
    return await db.transaction(async (tx) => {
        // 1️⃣ Insert submission (ID được tạo tự động)
        await tx.insert(ExerciseSubmissionsTable).values({
            exerciseId,
            userId,
            aiResultJson: JSON.stringify(aiResult),
        });

        const [submission] = await tx
            .select()
            .from(ExerciseSubmissionsTable)
            .where(
                and(
                    eq(ExerciseSubmissionsTable.userId, userId),
                    eq(ExerciseSubmissionsTable.exerciseId, exerciseId),
                ),
            )
            .orderBy(desc(ExerciseSubmissionsTable.createdAt))
            .limit(1);

        if (!submission) {
            throw new Error('Failed to fetch created submission');
        }

        for (const f of files) {
            await tx.insert(SubmissionFilesTable).values({
                exerciseSubmissionId: submission.id,
                s3Key: f.s3Key,
                fileType: f.fileType,
            });
        }

        const allSubmissions = await tx
            .select({ id: ExerciseSubmissionsTable.id })
            .from(ExerciseSubmissionsTable)
            .where(
                and(
                    eq(ExerciseSubmissionsTable.userId, userId),
                    eq(ExerciseSubmissionsTable.exerciseId, exerciseId),
                ),
            )
            .orderBy(asc(ExerciseSubmissionsTable.createdAt)); // ⬅️ Sắp xếp CŨ NHẤT lên đầu

        const allSubmissionIds = allSubmissions.map((s) => s.id);

        if (allSubmissionIds.length > MAX_SUBMISSIONS_TO_KEEP) {
            // Tính số lượng bản ghi CŨ NHẤT cần bị xóa
            const numToDelete = allSubmissionIds.length - MAX_SUBMISSIONS_TO_KEEP;

            // Lấy ID của các bản ghi CŨ NHẤT (bắt đầu từ vị trí 0)
            const submissionsToDelete = allSubmissionIds.slice(0, numToDelete);

            // 3a. XÓA các Bản ghi Files liên quan (trong SubmissionFilesTable)
            // Xóa file trước để dọn dẹp khóa ngoại
            await tx
                .delete(SubmissionFilesTable)
                .where(inArray(SubmissionFilesTable.exerciseSubmissionId, submissionsToDelete));

            // 3b. XÓA các Bản ghi Submission cũ (trong ExerciseSubmissionsTable)
            await tx
                .delete(ExerciseSubmissionsTable)
                .where(inArray(ExerciseSubmissionsTable.id, submissionsToDelete));

            console.log(`DB Cleanup: Deleted ${numToDelete} oldest submissions.`);
        }

        // 4️⃣ Lưu progress
        await tx
            .insert(ExerciseProgressTable)
            .values({
                userId,
                exerciseId,
                submissionStatus: 'SUBMITTED_ON_TIME',
                completedAt: new Date(),
            })
            .onDuplicateKeyUpdate({
                set: {
                    submissionStatus: 'SUBMITTED_ON_TIME',
                    completedAt: new Date(),
                },
            });

        revalidateExerciseCache(exerciseId);
        return submission;
    });
}
