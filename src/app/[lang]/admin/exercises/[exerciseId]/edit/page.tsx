import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
import { ClassesTable, ExercisesTable } from '@/drizzle/schema';
import { ExerciseForm } from '@/features/exercises/components/ExerciseForm';
import { PageHeader } from '@/components/PageHeader';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';

type Lang = 'vi' | 'en';

type ExerciseTexts = {
    exercises: {
        details: string;
        title: string;
        description: string;
    };
};

const texts: Record<Lang, ExerciseTexts> = {
    vi: {
        exercises: {
            details: 'Chi tiết',
            title: 'Bài tập',
            description:
                'Xem và quản lý tất cả bài tập, cập nhật thông tin, hạn nộp và điểm số của học sinh một cách hiệu quả.',
        },
    },
    en: {
        exercises: {
            details: 'Details',
            title: 'Exercises',
            description:
                'Browse and manage all exercises, update details, due dates, and student scores efficiently.',
        },
    },
};

function getTextsForLang(lang: string): ExerciseTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function EditExercisePage({
    params,
}: {
    params: { lang: string; exerciseId: string };
}) {
    const { lang, exerciseId } = params;

    const language = lang === 'vi' ? 'vi' : 'en';
    const textsForLang = getTextsForLang(language);

    const exercise = await getExercise(exerciseId);
    const classrooms = await getAllClassrooms();

    if (exercise == null) return notFound();

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.exercises.title}
                description={textsForLang.exercises.description}
            />
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">{textsForLang.exercises.details}</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <ExerciseForm
                                classrooms={classrooms}
                                exercise={exercise}
                                lang={lang as 'vi' | 'en'}
                            />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export async function getExercise(exerciseId: string) {
    'use cache';
    cacheTag(getExerciseGlobalTag());

    const exercise = await db.query.ExercisesTable.findFirst({
        where: eq(ExercisesTable.id, exerciseId),
        columns: {
            id: true,
            name: true,
            description: true,
            dueDate: true,
            maxScore: true,
            subject: true,
        },
        with: {
            exerciseClasses: {
                columns: { classId: true, order: true },
                with: {
                    class: {
                        columns: { id: true, name: true, description: true },
                    },
                },
            },
        },
    });

    if (!exercise) return null;

    // Lấy lớp học của học viên
    const sortedClasses = exercise.exerciseClasses
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
        ...exercise,
        subjectName: exercise.subject,
        dueDate: exercise.dueDate ?? undefined,
        maxScore: exercise.maxScore ?? undefined,
        classes: sortedClasses.map((uc) => ({
            classId: uc.classId, // dùng cho MultiSelect
            order: uc.order,
            ...uc.class, // chứa id, name, description
        })),
    };
}

export async function getAllClassrooms() {
    return db
        .select({
            id: ClassesTable.id,
            name: ClassesTable.name,
            description: ClassesTable.description,
        })
        .from(ClassesTable);
}
