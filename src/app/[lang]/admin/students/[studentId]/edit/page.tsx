import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { ClassesTable, UserTable } from '@/drizzle/schema';
import { UserForm } from '@/features/users/components/UserForm';
import { PageHeader } from '@/components/PageHeader';

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

export default async function EditStudentPage({
    params,
}: {
    params: { lang: string; studentId: string };
}) {
    const { lang, studentId } = params;

    const language = lang === 'vi' ? 'vi' : 'en';
    const textsForLang = getTextsForLang(language);

    const student = await getStudent(studentId);
    const classrooms = await getAllClassrooms();

    if (student == null) return notFound();

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.students.title}
                description={textsForLang.students.description}
            />
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">{textsForLang.students.details}</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <UserForm
                                classrooms={classrooms}
                                user={student}
                                lang={lang as 'vi' | 'en'}
                            />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export async function getStudent(userId: string) {
    'use cache';
    cacheTag(getUserGlobalTag());

    const student = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId),
        columns: {
            id: true,
            clerkUserId: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            role: true,
        },
        with: {
            userClasses: {
                columns: { classId: true, order: true },
                with: {
                    class: {
                        columns: { id: true, name: true, description: true },
                    },
                },
            },
        },
    });

    if (!student) return null;

    // Lấy lớp học của học viên
    const sortedClasses = student.userClasses
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
        ...student,
        classes: sortedClasses.map((uc) => ({
            classId: uc.classId, // dùng cho MultiSelect
            order: uc.order,
            ...uc.class, // chứa id, name, description
        })),
    };
}

// export async function getStudent(userId: string) {
//     'use cache';
//     cacheTag(getUserGlobalTag());

//     const student = await db.query.UserTable.findFirst({
//         where: eq(UserTable.id, userId),
//         columns: {
//             id: true,
//             clerkUserId: true,
//             email: true,
//             name: true,
//             role: true,
//         },
//         with: {
//             userClasses: {
//                 columns: { classId: true, order: true },
//                 with: {
//                     class: {
//                         columns: { id: true, name: true, description: true },
//                         with: {
//                             exerciseClasses: {
//                                 columns: { exerciseId: true },
//                                 with: {
//                                     exercise: {
//                                         columns: {
//                                             id: true,
//                                             name: true,
//                                             description: true,
//                                             subject: true,
//                                             dueDate: true,
//                                             maxScore: true,
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     if (!student) return null;

//     // 2️⃣ Sắp xếp lớp học theo thứ tự trong user_classes
//     const sortedClasses = student.userClasses
//         .slice()
//         .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

//     // 3️⃣ Gom toàn bộ bài tập từ các lớp
//     const exercises = sortedClasses.flatMap((uc) =>
//         uc.class.exerciseClasses.map((ec) => ec.exercise),
//     );

//     return {
//         ...student,
//         classes: sortedClasses.map((uc) => ({
//             classId: uc.classId, // 👈 đây chính là classroomId mà bạn cần
//             order: uc.order,
//             ...uc.class, // chứa id, name, description
//         })),
//         exercises,
//     };
// }

export async function getAllClassrooms() {
    return db
        .select({
            id: ClassesTable.id,
            name: ClassesTable.name,
            description: ClassesTable.description,
        })
        .from(ClassesTable);
}
