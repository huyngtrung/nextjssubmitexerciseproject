'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowRightIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/drizzle/schema';
import PracticeMode from './exercise/PracticeMode';
import HomeWorkMode from './exercise/HomeworkMode';

type Lang = 'vi' | 'en';

export type ExercisePageTexts = {
    layout: {
        nav: {
            home: string;
            exercise: string;
        };
    };
    exercise: {
        title: string;
        description: string;
        header: {
            title: string;
            PracticeMode: string;
            HomeworkMode: string;
        };
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
            uploadFile: {
                title: string;
                titledes: string;
            };
            uploadSolution: {
                title: string;
                titledes: string;
            };
            submit: {
                title: string;
            };
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

const texts: Record<Lang, ExercisePageTexts> = {
    vi: {
        layout: {
            nav: {
                home: 'Trang Chủ',
                exercise: 'Giới Thiệu',
            },
        },
        exercise: {
            title: 'Bạn cần đăng nhập để thực hiện',
            description: 'Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.',
            header: {
                title: 'Bài Tập',
                PracticeMode: 'Chế độ Luyện Tập',
                HomeworkMode: 'Chế Độ Bài Tập',
            },
            submitForm: {
                title: 'Trợ Lý Học Tập Thông Minh',
                chooseGrade: {
                    title: 'Chọn Lớp',
                    option1: 'Lớp 6',
                    option2: 'Lớp 7',
                    option3: 'Lớp 8',
                    option4: 'Lớp 9',
                },
                chooseSubject: {
                    title: 'Chọn Môn',
                    option1: 'Văn',
                    option2: 'Toán',
                    option3: 'Lý',
                    option4: 'Hóa',
                    option5: 'Anh',
                },
                uploadFile: {
                    title: 'Tải Lên Đề Bài',
                    titledes: 'Kéo hoặc nhấp chuột để tải file Đề Bài',
                },
                uploadSolution: {
                    title: 'Tải Lên Bài Làm',
                    titledes: 'Kéo hoặc nhấp chuột để tải file Bài Làm',
                },
                submit: {
                    title: 'Gửi',
                },
            },
            macoutTutorial: {
                title1: 'Xin Chào',
                des1: 'Mình là người hướng dẫn bạn.',
                title2: 'Chọn Lớp',
                des2: 'Đây là mục chọn khối, hãy lựa chọn chính xác.',
                title3: 'Chọn Môn',
                des3: 'Đây là mục chọn môn học của học',
                title4: 'Tải Lên Bài Tập',
                des4: 'Đây là nơi bạn gửi file bài tập của mình',
                title5: 'Tải Lên Đáp Án',
                des5: 'Còn đây nơi bạn gửi file bài làm của mình',
                title6: 'Nộp Bài',
                des6: 'Click vào nút sau để gửi bài.',
                title7: 'Kết Quả và nhận xết',
                des7: 'Sau khi chờ đợi bạn sẽ nhận được kết quả ở đây',
                title8: 'Tạm Biệt!',
                des8: 'Chúc bạn học tập vui vẻ!',
                next: 'Tiếp',
                back: 'Quay Lại',
                finish: 'Hoàn Thành',
                notice: 'Nhắc nhở',
                isChooseGrade: 'Vui lòng chọn lớp',
                isChooseSubject: 'Vui lòng chọn môn',
            },
        },
    },
    en: {
        layout: {
            nav: {
                home: 'Home',
                exercise: 'About',
            },
        },
        exercise: {
            title: 'You need to sign in to continue',
            description: 'Please sign in to access this feature.',
            header: {
                title: 'Exericise',
                PracticeMode: 'Practice Mode',
                HomeworkMode: 'Homework Mode',
            },
            submitForm: {
                title: 'Intelligent Homework Assistant',
                chooseGrade: {
                    title: 'Choose Grade',
                    option1: 'Grade6',
                    option2: 'Grade7',
                    option3: 'Grade8',
                    option4: 'Grade9',
                },
                chooseSubject: {
                    title: 'Choose Subject',
                    option1: 'Literature',
                    option2: 'Math',
                    option3: 'Physics',
                    option4: 'Chemistry',
                    option5: 'English',
                },
                uploadFile: {
                    title: 'Upload Your Exercise',
                    titledes: 'Drag or click to upload problem file',
                },
                uploadSolution: {
                    title: 'Upload Solution',
                    titledes: 'Drag or click to upload solution file',
                },
                submit: {
                    title: 'Submit',
                },
            },
            macoutTutorial: {
                title1: 'Hello',
                des1: 'I am the mascot here to guide you.',
                title2: 'Select Class',
                des2: 'Please choose the class that suits you.',
                title3: 'Select Subject',
                des3: 'Choose the subject you want to submit your assignment for.',
                title4: 'Upload Assignment File',
                des4: 'Click or drag your assignment file here.',
                title5: 'Upload Solution File',
                des5: 'Click or drag your completed work file here.',
                title6: 'Submit',
                des6: 'Once the files are uploaded, click Submit to send them.',
                title7: 'AI Results',
                des7: 'View AI explanations and feedback here.',
                title8: 'Goodbye!',
                des8: 'Wish you a great learning experience!',
                next: 'Next',
                back: 'Back',
                finish: 'Finish',
                notice: 'Notice',
                isChooseGrade: 'Please Choose Your Grade',
                isChooseSubject: 'Please Choose Your Subject',
            },
        },
    },
};

function getTextsForLang(lang: string): ExercisePageTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default function ExerciseClient({
    lang,
    userExercise,
}: {
    lang: 'vi' | 'en';
    userExercise: {
        id: string | undefined;
        role: UserRole | undefined;
        name: string | undefined | null;
        clerkUserId: string | null;
    };
}) {
    const textsForLang = getTextsForLang(lang);

    return (
        <div className="relative flex flex-col items-center overflow-hidden bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                    src="/exerciseimgs/9358474_4130965.jpg"
                    alt="Exercise Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <nav className="mb-2 text-sm text-white/80">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {textsForLang.exercise.header.title}
                        </h1>
                        <div className="flex gap-3 text-lg justify-center items-center">
                            <Link href="/" className="hover:text-yellow-400 text-cyan-200">
                                {textsForLang.layout.nav.home}
                            </Link>
                            <CircleArrowRightIcon /> {textsForLang.layout.nav.exercise}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="w-full max-w-4xl">
                {/* img background */}
                <div className=" pointer-events-none z-0">
                    <div className="absolute w-full h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src={`/exerciseimgs/alumni-form-bg-shape1.png`}
                                alt="123"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
                <div className=" pointer-events-none z-0">
                    <div className="absolute w-full h-full">
                        <div className="relative w-full h-full right-[70vh]">
                            <Image
                                src={`/exerciseimgs/alumni-form-bg-shape2.png`}
                                alt="123"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
                <div className=" pointer-events-none z-0">
                    <div className="absolute w-full h-full">
                        <div className="relative w-full h-[50vh] right-[30vh] top-[25vh]">
                            <Image
                                src={`/exerciseimgs/rocket-doodle.png`}
                                alt="123"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
                {/* img background end*/}

                <div className="w-full max-w-4xl px-4 flex flex-col justify-center gap-6 min-h-[130vh] md:h-[100vh]">
                    {/* header */}
                    <div className="py-8 text-center">
                        <div className="inline-block">
                            <h1 className=" text-2xl md:text-5xl font-bold mb-4">
                                {textsForLang.exercise.submitForm.title}
                            </h1>
                            <div className="flex items-center justify-center w-full">
                                <div className="h-[2px] bg-[#B1C74D] flex-1"></div>
                                <div className="h-[6px] bg-[#B1C74D] w-1/3 rounded"></div>
                                <div className="h-[2px] bg-[#B1C74D] flex-1"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Tabs
                            defaultValue="PracticeMode"
                            className="flex justify-center flex-col min-w-[140vh] "
                        >
                            <TabsList className="bg-transparent relative z-10 mb-8">
                                <TabsTrigger
                                    value="PracticeMode"
                                    className="text-gray-700 p-4 rounded-l-full cursor-pointer bg-gray-300 min-w-[160] border-y-2 border-l-2 border-r-1 border-black/80 text-md
                                    data-[state=active]:bg-[#A5C347]
                                    data-[state=active]:text-black
                                    data-[state=inactive]:text-gray-700"
                                >
                                    {textsForLang.exercise.header.PracticeMode}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="HomeworkMode"
                                    className="text-gray-700 p-4 rounded-r-full cursor-pointer bg-gray-300 min-w-[160] border-y-2 border-r-2 border-l-1 border-black/80 text-md
                                data-[state=active]:bg-[#A5C347]
                                data-[state=active]:text-black
                                data-[state=inactive]:text-gray-700"
                                >
                                    {textsForLang.exercise.header.HomeworkMode}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="PracticeMode">
                                <PracticeMode textsForLang={textsForLang} />
                            </TabsContent>

                            <TabsContent value="HomeworkMode">
                                <HomeWorkMode
                                    textsForLang={textsForLang}
                                    userExercise={userExercise}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
