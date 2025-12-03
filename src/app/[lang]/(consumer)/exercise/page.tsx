import ExerciseClient from '@/components/ExerciseClient';
import { db } from '@/drizzle/db';
import {
    ClassesTable,
    ExerciseClassesTable,
    ExerciseProgressTable,
    ExercisesTable,
    ExerciseSubmissionStatus,
    UserClassesTable,
    UserTable,
} from '@/drizzle/schema';
import { getClassroomGlobalTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { getCurrentUser } from '@/services/clerk';
import { eq, and } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export default async function ExercisePage({ params }: { params: Promise<{ lang: 'vi' | 'en' }> }) {
    const user = await getCurrentUser();
    const userName = await getUserName(user?.userId || '');

    if (!user || !user.userId) {
        return null;
    }
    const exerciseClasses = await getUserClassesWithExercises(user.userId);

    const { lang } = await params;

    const userExercise = {
        id: user.userId,
        role: user.role,
        name: userName,
        clerkUserId: user.clerkUserId,
        exerciseClasses: exerciseClasses,
    };

    return (
        <div>
            <ExerciseClient lang={lang} userExercise={userExercise} />
        </div>
    );
}

type ExerciseInfo = {
    id: string;
    name: string | null;
    description: string | null;
    subject: string | null;
    dueDate: Date | null;
    maxScore: number | null;
    s3key: string | null;
    status: ExerciseSubmissionStatus | null;
};

export type ClassWithExercises = {
    id: string;
    name: string;
    description: string | null;
    exercises: ExerciseInfo[];
};

async function getUserClassesWithExercises(userId: string): Promise<ClassWithExercises[]> {
    'use cache';
    cacheTag(getUserGlobalTag(), getClassroomGlobalTag(), getExerciseGlobalTag());

    const rows = await db
        .select({
            classId: ClassesTable.id,
            className: ClassesTable.name,
            classDescription: ClassesTable.description,
            exerciseId: ExercisesTable.id,
            exerciseName: ExercisesTable.name,
            exerciseDescription: ExercisesTable.description,
            subject: ExercisesTable.subject,
            dueDate: ExercisesTable.dueDate,
            maxScore: ExercisesTable.maxScore,
            s3key: ExercisesTable.s3Key,
            status: ExerciseProgressTable.submissionStatus,
        })
        .from(ClassesTable)
        .innerJoin(UserClassesTable, eq(UserClassesTable.classId, ClassesTable.id))
        .leftJoin(ExerciseClassesTable, eq(ExerciseClassesTable.classId, ClassesTable.id))
        .leftJoin(ExercisesTable, eq(ExercisesTable.id, ExerciseClassesTable.exerciseId))
        .leftJoin(
            ExerciseProgressTable,
            and(
                eq(ExerciseProgressTable.exerciseId, ExerciseClassesTable.exerciseId),
                eq(ExerciseProgressTable.userId, userId),
            ),
        )
        .where(eq(UserClassesTable.userId, userId));

    const classMap: Record<string, ClassWithExercises> = {};

    for (const row of rows) {
        if (!classMap[row.classId]) {
            classMap[row.classId] = {
                id: row.classId,
                name: row.className,
                description: row.classDescription,
                exercises: [],
            };
        }

        if (row.exerciseId) {
            classMap[row.classId]!.exercises.push({
                id: row.exerciseId,
                name: row.exerciseName,
                description: row.exerciseDescription,
                subject: row.subject,
                dueDate: row.dueDate,
                maxScore: row.maxScore,
                s3key: row.s3key,
                status: row.status,
            });
        }
    }

    return Object.values(classMap);
}

async function getUserName(userId: string) {
    'use cache';
    cacheTag(getUserGlobalTag(), getClassroomGlobalTag(), getExerciseGlobalTag());

    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId),
        columns: {
            name: true,
        },
    });

    return user?.name;
}
