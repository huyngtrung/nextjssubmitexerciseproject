'use client';

import { CheckIcon, FileTextIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ActionUrlButton } from '../ActionUrlButton';
import { ExerciseSubmissionStatus, UserRole } from '@/drizzle/schema';
import { ClassWithExercises } from '@/app/[lang]/(consumer)/exercise/page';
import {
    getLatestSubmissionAction,
    viewFileExerciseAction,
} from '@/features/exercises/actions/exercises';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { SubjectStats } from '@/app/[lang]/admin/students/detail/[studentId]/page';
import RightSlidePanel from './RightSlidePanel';

interface HomeWorkModeProps {
    lang: 'vi' | 'en';
    userExercise: {
        id: string | undefined;
        role: UserRole | undefined;
        name: string | undefined | null;
        clerkUserId: string | null;
        exerciseClasses: ClassWithExercises[];
        exerciseCount: SubjectStats[];
    };
}

type AiResultData = {
    examType: string[];
    generalFeedback: string;
    questions: { id: number; question: string; aiAnswer: string; type: string }[];
} | null;

export default function ExerciseList({ lang, userExercise }: HomeWorkModeProps) {
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('toan');
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

    const [latestAiResult, setLatestAiResult] = useState<AiResultData>(null);
    const [filterStatus, setFilterStatus] = useState<ExerciseSubmissionStatus | null | 'ALL'>(
        'ALL',
    );

    const currentSubjectStats = useMemo(() => {
        const normalizedSubject = subject.toLowerCase().trim();
        const stats = userExercise.exerciseCount.find(
            (item) => normalizeString(item.subject) === normalizedSubject,
        );

        return (
            stats ?? {
                subject,
                total: 0,
                completed: 0,
                completedOnTime: 0,
                completedLate: 0,
                notCompleted: 0,
            }
        );
    }, [userExercise.exerciseCount, subject]);

    const filteredExercises = useMemo(() => {
        if (!userExercise?.exerciseClasses) return [];

        const SUBJECT_MAP = {
            toan: ['toan', 'math', 'toán'],
            'ngu van': ['ngu van', 'literature', 'ngữ văn'],
            anh: ['anh', 'english'],
        };

        const allExercises =
            userExercise.exerciseClasses.flatMap((cls) =>
                cls.exercises.map((ex) => ({ ...ex, className: cls.name })),
            ) || [];

        const expectedKeywords = SUBJECT_MAP[subject as keyof typeof SUBJECT_MAP] || [];

        return allExercises.filter((ex) => {
            const dbSubject = ex.subject?.toLowerCase()?.trim() || '';

            const subjectMatch = expectedKeywords.includes(dbSubject);

            if (!subjectMatch) {
                return false;
            }

            const exerciseStatus = ex.status;

            if (filterStatus === 'ALL') {
                return true;
            }

            if (filterStatus === null) {
                return exerciseStatus === null;
            }

            if (filterStatus === 'SUBMITTED_ON_TIME' || filterStatus === 'SUBMITTED_LATE') {
                return (
                    exerciseStatus === 'SUBMITTED_ON_TIME' || exerciseStatus === 'SUBMITTED_LATE'
                );
            }

            return false;
        });
    }, [userExercise, subject, filterStatus]);

    const studentGrade = useMemo(() => {
        const rawDescriptions = userExercise.exerciseClasses.map((cls) => cls.description);

        const descriptions: string[] = rawDescriptions.filter((desc): desc is string => !!desc);

        return extractGradeFromClassName(descriptions);
    }, [userExercise.exerciseClasses]);

    const selectedExercise = filteredExercises.find((ex) => ex.id === selectedExerciseId);

    useState(() => {
        if (filteredExercises.length > 0 && selectedExerciseId === null && filteredExercises[0]) {
            setSelectedExerciseId(filteredExercises[0].id);
        }
    });

    const [slideData, setSlideData] = useState<{
        examType: string[];
        generalFeedback: string;
        questions: { id: number; question: string; aiAnswer: string; type: string }[];
    } | null>(null);

    const [slideOpen, setSlideOpen] = useState(false);

    useEffect(() => {
        async function fetchLatestSubmission() {
            if (!selectedExerciseId) {
                setLatestAiResult(null);
                return;
            }

            try {
                const result = await getLatestSubmissionAction(selectedExerciseId, userExercise.id);

                // Vì aiResult trong DB có thể là string JSON hoặc object tùy cấu hình Drizzle
                // Ta cần đảm bảo nó là object hợp lệ trước khi set vào state
                let parsedResult: AiResultData = null;
                if (result) {
                    try {
                        // Nếu result là string JSON (MySQL JSON type), ta cần parse
                        parsedResult =
                            typeof result === 'string'
                                ? JSON.parse(result)
                                : (result as AiResultData);
                    } catch (e) {
                        console.error('Failed to parse AI result JSON:', e);
                    }
                }
                setLatestAiResult(parsedResult);
            } catch (error) {
                console.error('Error fetching latest submission:', error);
                setLatestAiResult(null);
            }
        }
        fetchLatestSubmission();
    }, [selectedExerciseId]);

    useEffect(() => {}, [filteredExercises]);

    return (
        <div className="flex flex-col gap-6 justify-center">
            <RightSlidePanel
                title="Phản hồi"
                examType={latestAiResult ? latestAiResult.examType : slideData?.examType}
                generalFeedback={
                    latestAiResult ? latestAiResult.generalFeedback : slideData?.generalFeedback
                }
                data={latestAiResult ? latestAiResult.questions : slideData?.questions}
                open={slideOpen}
                onOpenChange={setSlideOpen}
            />
            <div className="flex flex-col p-4 bg-white rounded-xl shadow-lg border-l-4 border-[#8908F7]">
                <h2 className="text-xl font-bold text-gray-800 mb-2 border-b-2 border-gray-100 pb-2">
                    Thông tin học sinh
                </h2>
                <p className="flex gap-2 text-base text-gray-700">
                    <span className="font-semibold text-[#8908F7]">Lớp:</span>
                    {userExercise.exerciseClasses.map((item, index) => (
                        <span key={index}>
                            {item.description}
                            {index < userExercise.exerciseClasses.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
                <p className="flex gap-2 text-base text-gray-700">
                    <span className="font-semibold text-[#8908F7]">Họ tên:</span>
                    <span>{userExercise.name}</span>
                </p>
            </div>
            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg">
                {/* A. CHỌN MÔN HỌC */}
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold text-gray-800 border-b border-dashed border-[#A5C347] pb-1">
                        Danh sách môn học
                    </label>

                    <ToggleGroup
                        type="single"
                        value={subject}
                        onValueChange={(val) => val && setSubject(val)}
                        className="flex justify-start gap-3"
                    >
                        {/* Đã thêm hiệu ứng đổ bóng và bo tròn hiện đại hơn cho ToggleGroupItem */}
                        <ToggleGroupItem
                            value="toan"
                            aria-label="Toggle math"
                            className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base 
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                        >
                            Toán
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="ngu van"
                            aria-label="Toggle literature"
                            className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                        >
                            Ngữ văn
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="anh"
                            aria-label="Toggle english"
                            className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                        >
                            Anh
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-lg font-bold text-gray-800 border-b border-dashed border-[#A5C347] pb-1">
                        Danh sách bài tập
                    </label>

                    <div className="flex flex-col gap-3 overflow-y-auto max-h-56">
                        {filteredExercises.length > 0 ? (
                            <>
                                <div className="flex justify-end items-center gap-2 mb-4 px-1">
                                    <button
                                        onClick={() => setFilterStatus('ALL')}
                                        className={`py-1 px-3 text-sm rounded-full transition-colors 
                                                    ${
                                                        filterStatus === 'ALL'
                                                            ? 'bg-[#A5C347] text-white font-semibold shadow-md'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }
                                                `}
                                    >
                                        Tất cả
                                    </button>

                                    <button
                                        onClick={() => setFilterStatus(null)}
                                        className={`py-1 px-3 text-sm rounded-full transition-colors 
                                                    ${
                                                        filterStatus === null
                                                            ? 'bg-red-500 text-white font-semibold shadow-md'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }
                                                `}
                                    >
                                        Chưa làm
                                    </button>

                                    <button
                                        onClick={() => setFilterStatus('SUBMITTED_ON_TIME')}
                                        className={`py-1 px-3 text-sm rounded-full transition-colors 
                                                    ${
                                                        filterStatus === 'SUBMITTED_ON_TIME' ||
                                                        filterStatus === 'SUBMITTED_LATE'
                                                            ? 'bg-green-500 text-white font-semibold shadow-md'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }
                                                `}
                                    >
                                        Đã làm
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-1">
                                    {filteredExercises.map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            onClick={() => {
                                                setSelectedExerciseId(exercise.id);
                                                setSlideOpen(true);
                                            }}
                                            className={`w-full px-4 py-2 cursor-pointer transition-all rounded-lg text-sm border-2 shadow-sm
                                                        flex flex-col items-start 
                                                        ${
                                                            selectedExerciseId === exercise.id
                                                                ? 'bg-[#A5C347] border-[#000000] text-white font-semibold transform scale-[1.02]'
                                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                        }
                                                    `}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="truncate pr-2">
                                                    {exercise.name}
                                                </span>

                                                {exercise.status === 'SUBMITTED_ON_TIME' && (
                                                    <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
                                                )}
                                                {exercise.status === 'SUBMITTED_LATE' && (
                                                    <X className="w-4 h-4 text-gray-500 shrink-0" />
                                                )}
                                                {exercise.status == null && (
                                                    <X className="w-4 h-4 text-red-500 shrink-0" />
                                                )}
                                            </div>

                                            {exercise.dueDate && (
                                                <span
                                                    className={`text-xs mt-1 font-normal opacity-70 ${selectedExerciseId === exercise.id ? 'text-white' : 'text-gray-500'}`}
                                                >
                                                    Hạn:
                                                    {new Date(exercise.dueDate).toLocaleDateString(
                                                        'vi-VN',
                                                        {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false,
                                                            timeZone: 'Asia/Ho_Chi_Minh',
                                                        },
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2">
                                    <ActionUrlButton
                                        variant="outline"
                                        action={viewFileExerciseAction.bind(
                                            null,
                                            selectedExerciseId!,
                                        )}
                                        className="cursor-pointer w-full justify-center bg-[#8908F7] text-white hover:bg-[#7206d9] font-medium transition-colors border-2 border-[#8908F7] rounded-lg p-2"
                                    >
                                        <div className="flex gap-2 justify-center items-center">
                                            <FileTextIcon className="w-4 h-4" />
                                            {getFileNameFromS3Key(selectedExercise?.s3key)}
                                        </div>
                                    </ActionUrlButton>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                                Chưa có bài tập nào cho môn học này
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-[#8908F7] mb-3 border-b pb-2">
                        Thống kê Môn học: {subject == 'toan' && 'Toán'}
                        {subject == 'ngu van' && 'Ngữ Văn'} {subject == 'anh' && 'Tiếng Anh'}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Tổng số bài */}
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-center">
                            <p className="text-sm font-medium text-blue-700">Tổng số bài</p>
                            <p className="text-2xl font-extrabold text-blue-900 mt-1">
                                {currentSubjectStats.total || '0'}
                            </p>
                        </div>

                        {/* Đã làm */}
                        <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-lg text-center">
                            <p className="text-sm font-medium text-green-700">Đã làm</p>
                            <p className="text-2xl font-extrabold text-green-900 mt-1">
                                {currentSubjectStats.completed || '0'}
                            </p>
                        </div>

                        {/* Làm đúng hạn */}
                        <div className="p-3 bg-lime-50 border-l-4 border-lime-500 rounded-lg text-center">
                            <p className="text-sm font-medium text-lime-700">Đúng hạn</p>
                            <p className="text-2xl font-extrabold text-lime-900 mt-1">
                                {currentSubjectStats.completedOnTime || '0'}
                            </p>
                        </div>

                        {/* Làm muộn */}
                        <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-lg text-center">
                            <p className="text-sm font-medium text-orange-700">Làm muộn</p>
                            <p className="text-2xl font-extrabold text-orange-900 mt-1">
                                {currentSubjectStats.completedLate || '0'}
                            </p>
                        </div>

                        {/* Chưa làm */}
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-center">
                            <p className="text-sm font-medium text-red-700">Chưa làm</p>
                            <p className="text-2xl font-extrabold text-red-900 mt-1">
                                {currentSubjectStats.notCompleted || '0'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getFileNameFromS3Key(s3Key: string | undefined | null): string {
    if (!s3Key) return '';

    if (!s3Key.startsWith('exercises/')) return s3Key;

    const withoutPrefix = s3Key.replace(/^exercises\//, '');

    const prefixLength = 19 + 1 + 36 + 1;
    const fileName = withoutPrefix.slice(prefixLength);

    return fileName;
}

function extractGradeFromClassName(classDescriptions: string[]): string | null {
    if (!classDescriptions || classDescriptions.length === 0) return null;

    const description = classDescriptions[0];

    if (!description) return null;

    const match = description.match(/(?:Lớp|Khối)\s*(\d)/i);

    if (match && match[1]) {
        const gradeNumber = parseInt(match[1]);
        if (gradeNumber >= 6 && gradeNumber <= 9) {
            return gradeNumber.toString();
        }
    }

    return null;
}

function normalizeString(str: string) {
    return str
        .normalize('NFD') // tách dấu
        .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
        .toLowerCase()
        .trim();
}

{
    /* Danh sách bài tập */
}
