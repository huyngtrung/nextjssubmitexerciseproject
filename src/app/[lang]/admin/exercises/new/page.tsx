import { PageHeader } from '@/components/PageHeader';
import { db } from '@/drizzle/db';
import { ClassesTable } from '@/drizzle/schema';
import { ExerciseForm } from '@/features/exercises/components/ExerciseForm';

type Lang = 'vi' | 'en';

type ExerciseNewTexts = {
    exercises: {
        title: string;
        description: string;
    };
};

const texts: Record<Lang, ExerciseNewTexts> = {
    vi: {
        exercises: {
            title: 'Thêm bài tập mới',
            description:
                'Tạo bài tập mới bằng cách cung cấp tên, môn học, điểm tối đa và hạn nộp, sau đó gán cho học sinh để bắt đầu nhanh chóng.',
        },
    },
    en: {
        exercises: {
            title: 'Add New Exercise',
            description:
                'Create a new exercise by providing the name, subject, maximum score, and due date, then assign it to students to get started quickly.',
        },
    },
};

function getTextsForLang(lang: string): ExerciseNewTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function NewExercisesPage({
    params,
}: {
    params: Promise<{ lang: 'vi' | 'en' }>;
}) {
    const { lang } = await params;

    const textsForLang = getTextsForLang(lang);

    const classrooms = await getAllClassrooms();
    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={textsForLang.exercises.title}
                description={textsForLang.exercises.description}
            />
            <ExerciseForm classrooms={classrooms} lang={lang}></ExerciseForm>
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
