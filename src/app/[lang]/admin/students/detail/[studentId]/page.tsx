import ExerciseList from '@/components/exercise/ExcriseList';
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
import { eq, and } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

type Lang = 'vi' | 'en';

type StudentTexts = {
    students: {
        details: string;
        title: string;
        description: string;
    };
};

const texts: Record<Lang, StudentTexts> = {
    vi: {
        students: {
            details: 'Chi tiết',
            title: 'Học sinh',
            description:
                'Xem và quản lý tất cả học sinh, theo dõi lớp học và bài tập của từng học sinh một cách hiệu quả.',
        },
    },
    en: {
        students: {
            details: 'Details',
            title: 'Students',
            description:
                'Browse and manage all students, track their classrooms and exercises efficiently.',
        },
    },
};

function getTextsForLang(lang: string): StudentTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function DetailStudentPage({
    params,
}: {
    params: Promise<{ lang: 'vi' | 'en'; studentId: string }>;
}) {
    const { lang, studentId } = await params;
    const user = await getUser(studentId);

    const exerciseClasses = await getUserClassesWithExercises(studentId);

    const language = lang === 'vi' ? 'vi' : 'en';

    const userExercise = user
        ? {
              id: studentId,
              role: user.role,
              name: user.name,
              clerkUserId: user.clerkUserId,
              exerciseClasses: exerciseClasses.classes,
              exerciseCount: exerciseClasses.exerciseCount,
          }
        : {
              id: undefined,
              role: undefined,
              name: undefined,
              clerkUserId: null,
              exerciseClasses: exerciseClasses.classes,
              exerciseCount: exerciseClasses.exerciseCount,
          };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="flex min-w-[100vw] gap-6 justify-center items-center">
                <div className="flex w-full justify-center items-center flex-col gap-6">
                    <ExerciseList lang={lang} userExercise={userExercise}></ExerciseList>
                </div>
            </div>
        </div>
    );
}

export type SubjectStats = {
    subject: string;
    total: number;
    completed: number;
    completedOnTime: number;
    completedLate: number;
    notCompleted: number;
};

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

async function getUserClassesWithExercises(userId: string): Promise<{
    classes: ClassWithExercises[];
    exerciseCount: SubjectStats[];
}> {
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

    // --- Thêm map để thống kê theo subject ---
    const subjectStatsMap: Record<string, SubjectStats> = {};

    for (const row of rows) {
        // --- Giữ nguyên logic lớp + bài tập ---
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

        // --- Thống kê theo môn ---
        if (row.subject) {
            if (!subjectStatsMap[row.subject]) {
                subjectStatsMap[row.subject] = {
                    subject: row.subject,
                    total: 0,
                    completed: 0,
                    completedOnTime: 0,
                    completedLate: 0,
                    notCompleted: 0,
                };
            }

            const stat = subjectStatsMap[row.subject];
            if (stat) {
                stat.total += 1;

                if (row.status === 'SUBMITTED_ON_TIME') {
                    stat.completed += 1;
                    stat.completedOnTime += 1;
                } else if (row.status === 'SUBMITTED_LATE') {
                    stat.completed += 1;
                    stat.completedLate += 1;
                }
            }
        }
    }

    // --- Tính số bài chưa làm cho từng môn ---
    for (const s of Object.values(subjectStatsMap)) {
        s.notCompleted = s.total - s.completed;
    }

    return {
        classes: Object.values(classMap),
        exerciseCount: Object.values(subjectStatsMap),
    };
}

async function getUser(userId: string) {
    'use cache';
    cacheTag(getUserGlobalTag(), getClassroomGlobalTag(), getExerciseGlobalTag());

    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId),
        columns: {
            name: true,
            role: true,
            clerkUserId: true,
        },
    });

    return user;
}
