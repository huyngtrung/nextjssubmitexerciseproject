'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckIcon, FileTextIcon, X } from 'lucide-react';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { ExercisePageTexts } from '../ExerciseClient';
import RightSlidePanel from './RightSlidePanel';
import { ExerciseSubmissionStatus, UserRole } from '@/drizzle/schema';
import { ClassWithExercises } from '@/app/[lang]/(consumer)/exercise/page';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { ActionUrlButton } from '../ActionUrlButton';
import {
    getLatestSubmissionAction,
    saveUserSubmissionAction,
    viewFileExerciseAction,
} from '@/features/exercises/actions/exercises';
import { actionToast } from '@/lib/use-toast';
gsap.registerPlugin(ScrollToPlugin);

interface HomeWorkModeProps {
    textsForLang: ExercisePageTexts;
    userExercise: {
        id: string | undefined;
        role: UserRole | undefined;
        name: string | undefined | null;
        clerkUserId: string | null;
        exerciseClasses: ClassWithExercises[];
    };
}

type AiResultData = {
    examType: string[];
    generalFeedback: string;
    questions: { id: number; question: string; aiAnswer: string; type: string }[];
} | null;

export default function HomeWorkMode({ textsForLang, userExercise }: HomeWorkModeProps) {
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('toan');
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

    const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
    const [submissionProgress, setSubmissionProgress] = useState<Record<string, number>>({});

    const [latestAiResult, setLatestAiResult] = useState<AiResultData>(null);
    const [filterStatus, setFilterStatus] = useState<ExerciseSubmissionStatus | null | 'ALL'>(
        'ALL',
    );

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
        // 1. Lấy mảng các description, có thể là string hoặc null/undefined
        const rawDescriptions = userExercise.exerciseClasses.map((cls) => cls.description);

        // 2. Lọc bỏ các giá trị null/undefined để đảm bảo descriptions là string[]
        const descriptions: string[] = rawDescriptions.filter((desc): desc is string => !!desc);

        // 3. Truyền mảng string[] đã được làm sạch vào hàm
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

    const handleFileUpload = (file: File) => {
        const progressSetter = (val: number) => {
            setSubmissionProgress((prev) => ({ ...prev, [file.name]: val }));
        };
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) progress = 100;
            progressSetter(progress);
            if (progress === 100) clearInterval(interval);
        }, 200);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files) as File[];
        const combined = [...submissionFiles, ...newFiles].slice(0, 8);
        combined.forEach((f) => handleFileUpload(f));
        setSubmissionFiles(combined);
    };

    const handleCancelFile = (fileName: string) => {
        setSubmissionFiles((prev) => prev.filter((f) => f.name !== fileName));
        setSubmissionProgress((prev) => {
            const updated = { ...prev };
            delete updated[fileName];
            return updated;
        });
    };

    useEffect(() => {
        async function fetchLatestSubmission() {
            if (!selectedExerciseId) {
                setLatestAiResult(null);
                return;
            }

            try {
                // 🚨 GỌI HÀM SERVER ACTION ĐÃ SỬA
                const result = await getLatestSubmissionAction(selectedExerciseId);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submissionFiles.length === 0 || !selectedExerciseId || !studentGrade || !subject)
            return;
        if (Object.values(submissionProgress).some((p) => p < 100)) return;

        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('exerciseId', selectedExerciseId);
            formData.append('subject', subject);
            formData.append('grade', studentGrade);

            submissionFiles.forEach((f, idx) =>
                formData.append(
                    'submission',
                    new File([f], `bai-lam-${idx + 1}.${f.name.split('.').pop()}`),
                ),
            );

            const response = await fetch('/api/ai-homework-check', {
                method: 'POST',
                body: formData,
            });
            const resData = await response.json();

            setSlideData(resData.data);
            setSlideOpen(true);
            if (resData.data.isRelevant) {
                await saveUserSubmissionAction(selectedExerciseId, resData.data, submissionFiles);
            } else {
                actionToast({
                    actionData: {
                        error: true,
                        message: 'Bài làm em gửi không hợp lệ, vui lòng kiểm tra lại nhé!',
                    },
                });
            }

            setSubmissionFiles([]);
            setSubmissionProgress({});
            const submissionInput = document.querySelector<HTMLInputElement>(
                '#submission-upload input[type="file"]',
            );
            if (submissionInput) submissionInput.value = '';
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);

            setSubmissionFiles([]);
            setSubmissionProgress({});

            const submissionInput = document.querySelector<HTMLInputElement>(
                '#submission-upload input[type="file"]',
            );
            if (submissionInput) submissionInput.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center">
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

            <div className="flex min-w-[60vw] gap-6 justify-center">
                <div className="flex w-1/2 justify-start flex-col gap-6">
                    {/* 1. THÔNG TIN HỌC SINH (Profile Card) */}
                    <div className="flex flex-col p-4 bg-white rounded-xl shadow-lg border-l-4 border-[#8908F7]">
                        <h2 className="text-xl font-bold text-gray-800 mb-2 border-b-2 border-gray-100 pb-2">
                            {textsForLang.exercise.homeWordMode.userInfo.title}
                        </h2>
                        <p className="flex gap-2 text-base text-gray-700">
                            <span className="font-semibold text-[#8908F7]">
                                {textsForLang.exercise.homeWordMode.userInfo.classroom}:
                            </span>
                            {userExercise.exerciseClasses.map((item, index) => (
                                <span key={index}>
                                    {item.description}
                                    {index < userExercise.exerciseClasses.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </p>
                        <p className="flex gap-2 text-base text-gray-700">
                            <span className="font-semibold text-[#8908F7]">
                                {textsForLang.exercise.homeWordMode.userInfo.name}:
                            </span>
                            <span>{userExercise.name}</span>
                        </p>
                    </div>

                    {/* 2. KHỐI CHỌN MÔN HỌC & BÀI TẬP */}
                    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg">
                        {/* A. CHỌN MÔN HỌC */}
                        <div className="flex flex-col gap-2">
                            <label className="text-lg font-bold text-gray-800 border-b border-dashed border-[#A5C347] pb-1">
                                {textsForLang.exercise.homeWordMode.exerciseInfo.subjectTitle}:
                            </label>

                            <ToggleGroup
                                type="single"
                                value={subject}
                                onValueChange={(val) => val && setSubject(val)}
                                className="justify-start gap-3"
                            >
                                {/* Đã thêm hiệu ứng đổ bóng và bo tròn hiện đại hơn cho ToggleGroupItem */}
                                <ToggleGroupItem
                                    value="toan"
                                    aria-label="Toggle math"
                                    className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base 
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                                >
                                    {textsForLang.exercise.submitForm.chooseSubject.option2}
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="ngu van"
                                    aria-label="Toggle literature"
                                    className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                                >
                                    {textsForLang.exercise.submitForm.chooseSubject.option1}
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="anh"
                                    aria-label="Toggle english"
                                    className="cursor-pointer bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 transition-all rounded-full px-5 py-2 text-base
                                data-[state=on]:bg-[#A5C347] data-[state=on]:border-[#000000] data-[state=on]:text-white font-medium"
                                >
                                    {textsForLang.exercise.submitForm.chooseSubject.option5}
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* B. CHỌN BÀI TẬP */}
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-lg font-bold text-gray-800 border-b border-dashed border-[#A5C347] pb-1">
                                {textsForLang.exercise.homeWordMode.exerciseInfo.exerciseTitle}:
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
                                                onClick={() => setFilterStatus('SUBMITTED_ON_TIME')} // 🚨 Chỉ là một giá trị đại diện
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

                                                        {exercise.status ===
                                                            'SUBMITTED_ON_TIME' && (
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
                                                            {new Date(
                                                                exercise.dueDate,
                                                            ).toLocaleDateString('vi-VN', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false,
                                                                timeZone: 'Asia/Ho_Chi_Minh',
                                                            })}
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
                                        {textsForLang.exercise.homeWordMode.exerciseInfo.noExercise}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- Upload submission --- */}
                <div className="flex w-1/2 justify-end">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 relative z-10 w-full md:mb-12 mb-12"
                    >
                        {/* Submission Upload */}
                        <div className="flex flex-col gap-3">
                            <span className="font-semibold text-lg flex justify-between">
                                {textsForLang.exercise.submitForm.uploadSolution.title}
                                <span className="text-sm text-gray-500">
                                    ({submissionFiles.length}/8)
                                </span>
                            </span>
                            <div
                                id="submission-upload"
                                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition bg-white"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading || submissionFiles.length >= 8}
                                />
                                {submissionFiles.length > 0 ? (
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                        {submissionFiles.map((file) => (
                                            <div
                                                key={file.name}
                                                className="flex flex-col bg-gray-50 border rounded-lg p-2 shadow-sm"
                                            >
                                                <div className="flex justify-between items-center z-20">
                                                    <span className="text-gray-700 font-medium text-sm truncate">
                                                        {truncateFileName(file.name)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelFile(file.name);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer bg-gray-200 rounded-full p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${submissionProgress[file.name] || 0}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        {textsForLang.exercise.submitForm.uploadSolution.titledes}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="submit-btn"
                            disabled={
                                loading ||
                                submissionFiles.length === 0 ||
                                Object.values(submissionProgress).some((p) => p < 100)
                            }
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {textsForLang.exercise.submitForm.submit.title}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const truncateFileName = (name: string, maxLength = 12) => {
    const dotIndex = name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? name.slice(dotIndex) : '';
    const base = dotIndex !== -1 ? name.slice(0, dotIndex) : name;
    return base.length > maxLength ? base.slice(0, maxLength) + '...' + ext : name;
};

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
