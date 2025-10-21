import { PageHeader } from '@/components/PageHeader';
import { ClassroomForm } from '@/features/classrooms/components/ClassroomForm';

type Lang = 'vi' | 'en';

type ClassroomNewTexts = {
    classrooms: {
        title: string;
        description: string;
    };
};

const texts: Record<Lang, ClassroomNewTexts> = {
    vi: {
        classrooms: {
            title: 'Thêm lớp học mới',
            description:
                'Tạo lớp học mới bằng cách cung cấp tên và mô tả, sau đó thêm học sinh để bắt đầu nhanh chóng.',
        },
    },
    en: {
        classrooms: {
            title: 'Add New Classroom',
            description:
                'Create a new classroom by providing a name and description, then assign students to get started quickly.',
        },
    },
};

function getTextsForLang(lang: string): ClassroomNewTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function NewClassroomsPage({ params }: { params: { lang: string } }) {
    const lang = params.lang === 'vi' ? 'vi' : 'en';
    const textsForLang = getTextsForLang(lang);

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.classrooms.title}
                description={textsForLang.classrooms.description}
            />
            <ClassroomForm lang={lang}></ClassroomForm>
        </div>
    );
}
