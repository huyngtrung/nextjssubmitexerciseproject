import { PageHeader } from '@/components/PageHeader';
import { db } from '@/drizzle/db';
import { ClassesTable } from '@/drizzle/schema';
import { UserForm } from '@/features/users/components/UserForm';

type Lang = 'vi' | 'en';

type StudentNewTexts = {
    Students: {
        title: string;
        description: string;
    };
};

const texts: Record<Lang, StudentNewTexts> = {
    vi: {
        Students: {
            title: 'Thêm học sinh mới',
            description:
                'Tạo học sinh mới bằng cách cung cấp tên và mô tả, sau đó thêm học sinh để bắt đầu nhanh chóng.',
        },
    },
    en: {
        Students: {
            title: 'Add New Student',
            description:
                'Create a new Student by providing a name and description, then assign students to get started quickly.',
        },
    },
};

function getTextsForLang(lang: string): StudentNewTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function NewStudentsPage({
    params,
}: {
    params: Promise<{ lang: 'vi' | 'en' }>;
}) {
    const { lang } = await params;
    // const lang = (await params.lang) === 'vi' ? 'vi' : 'en';

    const textsForLang = getTextsForLang(lang);

    const classrooms = await getAllClassrooms();

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.Students.title}
                description={textsForLang.Students.description}
            />
            <UserForm classrooms={classrooms} lang={lang}></UserForm>
        </div>
    );
}

async function getAllClassrooms() {
    return db
        .select({
            id: ClassesTable.id,
            name: ClassesTable.name,
            description: ClassesTable.description,
        })
        .from(ClassesTable);
}
