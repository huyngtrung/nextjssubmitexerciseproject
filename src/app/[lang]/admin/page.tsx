import { db } from '@/drizzle/db';
import { eq, and } from 'drizzle-orm';
import {
    ClassesTable,
    ExerciseClassesTable,
    ExerciseProgressTable,
    ExercisesTable,
    UserClassesTable,
    UserTable,
} from '@/drizzle/schema';
import { getClassroomGlobalTag } from '@/features/classrooms/db/cache/classrooms';
import { getExerciseGlobalTag } from '@/features/exercises/db/cache';
import { getUserGlobalTag } from '@/features/users/db/cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import AdminPageClient from '@/components/admin/AdminPageClient';

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

export default async function AdminPage({ params }: { params: Promise<{ lang: 'vi' | 'en' }> }) {
    const { lang } = await params;

    // const classesData = await getClassesStudents();
    const textsForLang = getTextsForLang(lang);
    const subjects = ['Math', 'Physics', 'Chemistry', 'English', 'Vietnamese'];
    const classNames = ['9A', '9B', '9C', '9D', '9E'];

    // Số lượng bài cố định theo môn
    const subjectExercisesCount: Record<string, number> = {
        Math: 30,
        Physics: 22,
        Chemistry: 18,
        English: 45,
        Vietnamese: 9,
    };

    // Tạo danh sách bài tập chung cho tất cả học sinh
    interface ExerciseTemplate {
        id: string;
        name: string;
        subject: string;
    }

    const exerciseTemplates: ExerciseTemplate[] = [];
    for (const subject of subjects) {
        const count = subjectExercisesCount[subject];
        for (let i = 1; i <= count; i++) {
            exerciseTemplates.push({
                id: `${subject}-ex-${i}`,
                name: `Exercise ${i} (${subject})`,
                subject,
            });
        }
    }

    const classesData: ClassWithStudents[] = [];

    for (let c = 0; c < classNames.length; c++) {
        const classId = `class-${classNames[c]}`;
        const students: StudentInfo[] = [];

        // Phân bố học sinh theo mức độ làm bài: làm hết, làm nhiều, làm trung bình, làm ít
        const fullDone = 5; // làm hết
        const manyDone = 10; // làm nhiều
        const mediumDone = 15; // làm trung bình
        const fewDone = 10; // làm ít

        for (let s = 1; s <= 40; s++) {
            const studentId = `${classId}-student-${s}`;
            const exercises: ExerciseInfo[] = [];

            for (const exTemplate of exerciseTemplates) {
                let status: ExerciseInfo['status'] | null = null;

                // Xác định tỉ lệ làm bài theo nhóm
                const rand = Math.random();
                if (s <= fullDone) {
                    status = rand < 0.9 ? 'SUBMITTED_ON_TIME' : 'SUBMITTED_LATE';
                } else if (s <= fullDone + manyDone) {
                    if (rand < 0.75) status = 'SUBMITTED_ON_TIME';
                    else if (rand < 0.9) status = 'SUBMITTED_LATE';
                    else status = null;
                } else if (s <= fullDone + manyDone + mediumDone) {
                    if (rand < 0.5) status = 'SUBMITTED_ON_TIME';
                    else if (rand < 0.7) status = 'SUBMITTED_LATE';
                    else status = null;
                } else {
                    if (rand < 0.2) status = 'SUBMITTED_ON_TIME';
                    else if (rand < 0.3) status = 'SUBMITTED_LATE';
                    else status = null;
                }

                exercises.push({
                    id: exTemplate.id,
                    name: exTemplate.name,
                    description: `Mô tả ${exTemplate.name}`,
                    subject: exTemplate.subject,
                    dueDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
                    maxScore: 10,
                    s3key: null,
                    status,
                });
            }

            students.push({
                id: studentId,
                clerkUserId: `clerk-${studentId}`,
                name: `Student ${s} Class ${classNames[c]}`,
                firstName: `Student${s}`,
                lastName: `Class${classNames[c]}`,
                role: 'user',
                email: `student${s}_class${classNames[c]}@example.com`,
                exercises,
            });
        }

        classesData.push({
            id: classId,
            name: classNames[c],
            description: `Mô tả lớp ${classNames[c]}`,
            order: c + 1,
            students,
        });
    }

    // Trả JSX cho Next.js
    return <AdminPageClient classes={classesData} lang={lang} />;
}

interface ExerciseInfo {
    id: string;
    name: string | null;
    description: string | null;
    subject: string | null;
    dueDate: Date | null;
    maxScore: number | null;
    s3key: string | null;
    status: ExerciseSubmissionStatus | null;
}

interface StudentInfo {
    id: string;
    clerkUserId: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    role: 'user' | 'admin';
    email: string;
    exercises: ExerciseInfo[];
}

interface ClassWithStudents {
    id: string;
    name: string;
    description: string | null;
    order: number;
    students: StudentInfo[];
}

async function getClassesStudents(): Promise<ClassWithStudents[]> {
    'use cache';

    // Tag cache chung cho lớp, user, bài tập
    cacheTag(getClassroomGlobalTag(), getUserGlobalTag(), getExerciseGlobalTag());

    // Query tất cả lớp + học sinh + bài tập + tiến trình
    const rows = await db
        .select({
            classId: ClassesTable.id,
            className: ClassesTable.name,
            classDescription: ClassesTable.description,
            classOrder: ClassesTable.order,
            studentId: UserTable.id,
            clerkUserId: UserTable.clerkUserId,
            studentName: UserTable.name,
            firstName: UserTable.firstName,
            lastName: UserTable.lastName,
            role: UserTable.role,
            email: UserTable.email,
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
        .leftJoin(UserClassesTable, eq(UserClassesTable.classId, ClassesTable.id))
        .leftJoin(UserTable, eq(UserTable.id, UserClassesTable.userId))
        .leftJoin(ExerciseClassesTable, eq(ExerciseClassesTable.classId, ClassesTable.id))
        .leftJoin(ExercisesTable, eq(ExercisesTable.id, ExerciseClassesTable.exerciseId))
        .leftJoin(
            ExerciseProgressTable,
            and(
                eq(ExerciseProgressTable.exerciseId, ExerciseClassesTable.exerciseId),
                eq(ExerciseProgressTable.userId, UserTable.id),
            ),
        )
        .where(eq(UserTable.role, 'user'));

    const classMap: Record<string, ClassWithStudents> = {};

    for (const row of rows) {
        if (!row.classId) continue;

        // Khởi tạo lớp nếu chưa có
        if (!classMap[row.classId]) {
            classMap[row.classId] = {
                id: row.classId,
                name: row.className,
                description: row.classDescription,
                order: row.classOrder ?? 0,
                students: [],
            };
        }

        const classEntry = classMap[row.classId]!;

        if (!row.studentId) continue;

        // Kiểm tra xem học sinh đã có trong lớp chưa
        let student = classEntry.students.find((s) => s.id === row.studentId);
        if (!student) {
            student = {
                id: row.studentId,
                clerkUserId: row.clerkUserId ?? '',
                name: row.studentName ?? null,
                firstName: row.firstName ?? null,
                lastName: row.lastName ?? null,
                role: row.role === 'admin' ? 'admin' : 'user',
                email: row.email ?? '',
                exercises: [],
            };
            classEntry.students.push(student);
        }

        // Thêm bài tập nếu có
        if (row.exerciseId) {
            student.exercises.push({
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
