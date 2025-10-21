import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import { ClassesTable, ExerciseClassesTable, ExercisesTable } from '@/drizzle/schema';
import { getClassroomGlobalTag } from '@/features/classrooms/db/cache/classrooms';
import { ExerciseTableComponent } from '@/features/exercises/components/ExerciseTableComponent';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

type Lang = 'vi' | 'en';

type ExerciseTexts = {
    exercises: {
        title: string;
        description: string;
        addNew: string;
    };
};

const texts: Record<Lang, ExerciseTexts> = {
    vi: {
        exercises: {
            title: 'Bài tập',
            description:
                'Duyệt tất cả bài tập, quản lý thông tin, hạn nộp và điểm số của học sinh một cách hiệu quả.',
            addNew: 'Thêm bài tập mới',
        },
    },
    en: {
        exercises: {
            title: 'Exercises',
            description:
                'Browse all exercises, manage details, due dates, and student scores efficiently.',
            addNew: 'Add New Exercise',
        },
    },
};

function getTextsForLang(lang: string): ExerciseTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function ExercisePage({ params }: { params: { lang: string } }) {
    const lang = params.lang === 'vi' ? 'vi' : 'en';

    const exercises = await getExercises();

    const textsForLang = getTextsForLang(lang);

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.exercises.title}
                description={textsForLang.exercises.description}
            />

            <div className="flex justify-end my-4">
                <Button asChild>
                    <Link href={`/${lang}/admin/exercises/new`}>
                        {textsForLang.exercises.addNew}
                    </Link>
                </Button>
            </div>

            <ExerciseTableComponent exercises={exercises} lang={lang}></ExerciseTableComponent>
        </div>
    );
}

async function getExercises() {
    'use cache';

    cacheTag(getClassroomGlobalTag(), getUserGlobalTag(), getExerciseGlobalTag());

    const rows = await db
        .select({
            id: ExercisesTable.id,
            name: ExercisesTable.name,
            description: ExercisesTable.description,
            dueDate: ExercisesTable.dueDate,
            maxScore: ExercisesTable.maxScore,
            subject: ExercisesTable.subject,
            classId: ClassesTable.id,
            className: ClassesTable.name,
            classDescription: ClassesTable.description,
            classOrder: ClassesTable.order,
        })
        .from(ExercisesTable)
        .leftJoin(ExerciseClassesTable, eq(ExercisesTable.id, ExerciseClassesTable.exerciseId))
        .leftJoin(ClassesTable, eq(ExerciseClassesTable.classId, ClassesTable.id));

    // Gom các lớp của cùng 1 user vào mảng
    const exercisesMap: Record<string, any> = {};

    for (const row of rows) {
        if (!exercisesMap[row.id]) {
            exercisesMap[row.id] = {
                id: row.id,
                name: row.name,
                description: row.description,
                dueDate: row.dueDate,
                maxScore: row.maxScore,
                subject: row.subject,
                classes: [],
            };
        }

        if (row.classId) {
            exercisesMap[row.id].classes.push({
                id: row.classId,
                name: row.className,
                description: row.classDescription,
                order: row.classOrder,
            });
        }
    }

    return Object.values(exercisesMap);

    return Object.values(exercisesMap);
}
