import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/drizzle/db';
import { ClassesTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
import { getClassroomIdTag } from '@/features/classrooms/db/cache/classrooms';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { ClassroomForm } from '@/features/classrooms/components/ClassroomForm';
import { PageHeader } from '@/components/PageHeader';

type Lang = 'vi' | 'en';

type ClassroomTexts = {
    classrooms: {
        details: string;
        title: string;
        description: string;
    };
};

const texts: Record<Lang, ClassroomTexts> = {
    vi: {
        classrooms: {
            details: 'Chi tiết',
            title: 'Chỉnh sửa lớp học',
            description:
                'Cập nhật thông tin lớp học, quản lý học sinh, theo dõi bài tập và đảm bảo môi trường học tập luôn chính xác.',
        },
    },
    en: {
        classrooms: {
            details: 'details',
            title: 'Edit Classroom',
            description:
                'Update classroom details, manage enrolled students, track exercises, and ensure your classroom environment is accurate.',
        },
    },
};

function getTextsForLang(lang: string): ClassroomTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function EditClassroomPage({
    params,
}: {
    params: { lang: string; classroomId: string };
}) {
    const { lang, classroomId } = params;

    const language = lang === 'vi' ? 'vi' : 'en';
    const textsForLang = getTextsForLang(language);

    const classroom = await getClassroom(classroomId);

    if (classroom == null) return notFound();

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.classrooms.title}
                description={textsForLang.classrooms.description}
            />
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">{textsForLang.classrooms.details}</TabsTrigger>
                    {/* clasroom detail */}
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <ClassroomForm classroom={classroom} lang={lang as 'vi' | 'en'} />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

async function getClassroom(id: string) {
    'use cache';
    cacheTag(getClassroomIdTag(id), getUserGlobalTag(), getExerciseGlobalTag());

    const classroom = await db.query.ClassesTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(ClassesTable.id, id),
        with: {
            userClasses: {
                columns: { userId: true, classId: true, order: true },
                with: {
                    user: {
                        columns: {
                            id: true,
                            clerkUserId: true,
                            email: true,
                            name: true,
                            role: true,
                        },
                    },
                },
            },
            exerciseClasses: {
                columns: { exerciseId: true, classId: true, order: true },
                with: {
                    exercise: {
                        columns: {
                            id: true,
                            subject: true,
                            name: true,
                            description: true,
                            dueDate: true,
                            maxScore: true,
                        },
                    },
                },
            },
        },
    });

    if (!classroom) return null;

    // Sort theo order trong bảng UserClassesTable
    const sortedUserClasses = classroom.userClasses
        .slice() // tạo bản sao để không mutate gốc
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
        ...classroom,
        userClasses: sortedUserClasses,
    };
}
