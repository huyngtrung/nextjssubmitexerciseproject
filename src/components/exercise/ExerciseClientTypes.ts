import type { UserRole } from '@/drizzle/schema';

export type ExercisePageTexts = {
    layout: {
        nav: { home: string; exercise: string };
    };
    exercise: {
        title: string;
        description: string;
        header: { title: string; PracticeMode: string; HomeworkMode: string };
        submitForm: {
            title: string;
            chooseGrade: {
                title: string;
                option1: string;
                option2: string;
                option3: string;
                option4: string;
            };
            chooseSubject: {
                title: string;
                option1: string;
                option2: string;
                option3: string;
                option4: string;
                option5: string;
            };
            uploadFile: { title: string; titledes: string };
            uploadSolution: { title: string; titledes: string };
            submit: { title: string };
        };
        macoutTutorial: any;
    };
};

export type UserExercise = {
    id: string | undefined;
    role: UserRole | undefined;
    name: string | undefined | null;
    clerkUserId: string | null;
};
