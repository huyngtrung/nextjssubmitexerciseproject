import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import { ClassesTable, UserClassesTable, UserTable } from '@/drizzle/schema';
import { getClassroomGlobalTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { UserTableComponent } from '@/features/users/components/UserTableComponent';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';

type Lang = 'vi' | 'en';

type StudentTexts = {
    students: {
        title: string;
        description: string;
        addNew: string;
    };
};

const texts: Record<Lang, StudentTexts> = {
    vi: {
        students: {
            title: 'Học sinh',
            description:
                'Duyệt tất cả học sinh, xem lớp học mà họ tham gia, theo dõi bài tập và quản lý thông tin học sinh hiệu quả.',
            addNew: 'Thêm học sinh mới',
        },
    },
    en: {
        students: {
            title: 'Students',
            description:
                'Browse all students, view their enrolled classrooms, track exercises, and manage student information efficiently.',
            addNew: 'Add New Student',
        },
    },
};

function getTextsForLang(lang: string): StudentTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function StudentPage({ params }: { params: Promise<{ lang: 'vi' | 'en' }> }) {
    const { lang } = await params;

    const students = await getStudents();
    const textsForLang = getTextsForLang(lang);

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.students.title}
                description={textsForLang.students.description}
            />
            <div className="flex justify-end my-4">
                <Button asChild>
                    <Link href={`/${lang}/admin/students/new`}>{textsForLang.students.addNew}</Link>
                </Button>
            </div>

            <UserTableComponent students={students} lang={lang}></UserTableComponent>
        </div>
    );
}

interface StudentClass {
    id: string;
    name: string;
    description: string;
    order: number;
}

interface StudentMapEntry {
    id: string;
    clerkUserId: string; // nếu component yêu cầu string
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    role: 'user' | 'admin';
    email: string;
    classes: StudentClass[];
}

async function getStudents(): Promise<StudentMapEntry[]> {
    'use cache';

    cacheTag(getClassroomGlobalTag(), getUserGlobalTag(), getExerciseGlobalTag());

    const rows = await db
        .select({
            userId: UserTable.id,
            clerkUserId: UserTable.clerkUserId,
            name: UserTable.name,
            firstName: UserTable.firstName,
            lastName: UserTable.lastName,
            role: UserTable.role,
            email: UserTable.email,
            classId: ClassesTable.id,
            className: ClassesTable.name,
            classDescription: ClassesTable.description,
            classOrder: ClassesTable.order,
        })
        .from(UserTable)
        .leftJoin(UserClassesTable, eq(UserTable.id, UserClassesTable.userId))
        .leftJoin(ClassesTable, eq(UserClassesTable.classId, ClassesTable.id))
        .where(eq(UserTable.role, 'user'));

    const studentsMap: Record<string, StudentMapEntry> = {};

    for (const row of rows) {
        if (!row.userId) continue;

        // Khởi tạo StudentMapEntry nếu chưa có
        if (!(row.userId in studentsMap)) {
            studentsMap[row.userId] = {
                id: row.userId,
                clerkUserId: row.clerkUserId ?? '',
                name: row.name ?? null,
                firstName: row.firstName ?? null,
                lastName: row.lastName ?? null,
                role: row.role === 'admin' ? 'admin' : 'user',
                email: row.email ?? '',
                classes: [],
            };
        }

        // Truy cập chắc chắn object
        const student = studentsMap[row.userId]!;

        // Thêm lớp nếu có
        if (row.classId) {
            student.classes.push({
                id: row.classId,
                name: row.className ?? '',
                description: row.classDescription ?? '',
                order: row.classOrder ?? 0,
            });
        }
    }

    return Object.values(studentsMap);
}
