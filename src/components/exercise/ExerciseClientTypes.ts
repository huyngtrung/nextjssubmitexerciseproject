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
        macoutTutorial: {
            title1: string;
            des1: string;
            title2: string;
            des2: string;
            title3: string;
            des3: string;
            title4: string;
            des4: string;
            title5: string;
            des5: string;
            title6: string;
            des6: string;
            title7: string;
            des7: string;
            title8: string;
            des8: string;
            next: string;
            back: string;
            finish: string;
            notice: string;
            isChooseGrade: string;
            isChooseSubject: string;
        };
    };
};

export type UserExercise = {
    id: string | undefined;
    role: UserRole | undefined;
    name: string | undefined | null;
    clerkUserId: string | null;
};
