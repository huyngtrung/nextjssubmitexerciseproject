import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import { ClassesTable, ExerciseClassesTable, UserClassesTable } from '@/drizzle/schema';
import { ClassroomTable } from '@/features/classrooms/components/ClassroomTable';
import { getClassroomGlobalTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { getCurrentUser } from '@/services/clerk';
import { countDistinct, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';

type Lang = 'vi' | 'en';

type ClassroomTexts = {
    classrooms: {
        title: string;
        description: string;
        addNew: string;
    };
};

const texts: Record<Lang, ClassroomTexts> = {
    vi: {
        classrooms: {
            title: 'Lớp học',
            description:
                'Duyệt tất cả lớp học, xem số lượng học sinh, theo dõi bài tập và quản lý môi trường học tập hiệu quả.',
            addNew: 'Thêm lớp học mới',
        },
    },
    en: {
        classrooms: {
            title: 'Classrooms',
            description:
                'Browse all classrooms, view student counts, track exercises, and manage your educational environment efficiently.',
            addNew: 'Add New Classroom',
        },
    },
};

function getTextsForLang(lang: string): ClassroomTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function ClassroomPage({
    params,
}: {
    params: Promise<{ lang: 'vi' | 'en' }>;
}) {
    const { lang } = await params;
    const currentUser = await getCurrentUser();
    interface Classroom {
        id: string;
        name: string;
        description: string;
        usersCount: number;
        exercisesCount: number;
    }
    let classrooms: Classroom[] = [];

    if (currentUser.role == 'admin') {
        classrooms = await getclassrooms();
    }

    // const classrooms = await getclassrooms();

    const textsForLang = getTextsForLang(lang);

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.classrooms.title}
                description={textsForLang.classrooms.description}
            />
            <div className="flex justify-end my-4 ">
                <Button className="min-w-[172]" asChild>
                    <Link href={`/${lang}/admin/classrooms/new`}>
                        {textsForLang.classrooms.addNew}
                    </Link>
                </Button>
            </div>
            <ClassroomTable classrooms={classrooms} lang={lang}></ClassroomTable>
        </div>
    );
}

async function getclassrooms() {
    'use cache';

    cacheTag(getClassroomGlobalTag(), getUserGlobalTag(), getExerciseGlobalTag());

    return await db
        .select({
            id: ClassesTable.id,
            name: ClassesTable.name,
            description: ClassesTable.description,

            // Đếm số học sinh trong lớp qua bảng user_classes
            usersCount: countDistinct(UserClassesTable.userId).mapWith(Number).as('usersCount'),

            // Đếm số bài tập trong lớp qua bảng exercise_classes
            exercisesCount: countDistinct(ExerciseClassesTable.exerciseId)
                .mapWith(Number)
                .as('exercisesCount'),
        })
        .from(ClassesTable)
        // JOIN để lấy dữ liệu trung gian
        .leftJoin(UserClassesTable, eq(UserClassesTable.classId, ClassesTable.id))
        .leftJoin(ExerciseClassesTable, eq(ExerciseClassesTable.classId, ClassesTable.id))
        .groupBy(ClassesTable.id);
}
