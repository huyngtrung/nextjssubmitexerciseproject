'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { ExercisePageTexts } from '../ExerciseClient';
gsap.registerPlugin(ScrollToPlugin);

type Message = { text: string; sender: 'user' | 'bot' };

interface PracticeModeProps {
    textsForLang: ExercisePageTexts;
}

export default function PracticeMode({ textsForLang }: PracticeModeProps) {
    // --- Mascot animation cho thanh load ---
    const animateMascotProgress = (progress: number, type: 'problem' | 'solution') => {
        const mascot = document.getElementById('mascout');
        const bar = document.getElementById(
            type === 'problem' ? 'problem-upload' : 'solution-upload',
        );
        if (!mascot || !bar) return;

        const barRect = bar.getBoundingClientRect();
        const x = barRect.left + barRect.width * (progress / 100) - 32 + window.scrollX;
        const y = barRect.top + window.scrollY - 60;
        const jump = (progress % 10) - 5;
        gsap.to(mascot, { x, y: y - jump, duration: 0.2, ease: 'power1.inOut' });
    };

    const showMascotReminder = (title: string, text: string) => {
        const mascot = document.getElementById('mascout');
        const tooltip = document.getElementById('tooltip');
        const overlay = document.getElementById('tutorial-overlay');
        if (!mascot || !tooltip || !overlay) return;

        gsap.set(mascot, {
            top: window.innerHeight / 2 - 40,
            left: window.innerWidth / 2 - 40,
            backgroundImage: "url('/mascoutimgs/reminder.png')",
        });
        tooltip.innerHTML = `<div class="font-bold text-lg mb-2">${title}!</div><p class="text-gray-700">${text}</p>`;

        gsap.to([mascot, tooltip, overlay], { opacity: 1, duration: 0.4, pointerEvents: 'auto' });
        setTimeout(() => {
            gsap.to([mascot, tooltip, overlay], {
                opacity: 0,
                duration: 0.4,
                pointerEvents: 'none',
            });
        }, 1000);
    };

    // --- Tutorial hướng dẫn ---
    const animateTutorial = () => {
        const steps = [
            {
                elId: 'class-select',
                title: textsForLang.exercise.macoutTutorial.title2,
                text: textsForLang.exercise.macoutTutorial.des2,
            },
            {
                elId: 'subject-select',
                title: textsForLang.exercise.macoutTutorial.title3,
                text: textsForLang.exercise.macoutTutorial.des3,
            },
            {
                elId: 'problem-upload',
                title: textsForLang.exercise.macoutTutorial.title4,
                text: textsForLang.exercise.macoutTutorial.des4,
            },
            {
                elId: 'solution-upload',
                title: textsForLang.exercise.macoutTutorial.title5,
                text: textsForLang.exercise.macoutTutorial.des5,
            },
            {
                elId: 'submit-btn',
                title: textsForLang.exercise.macoutTutorial.title6,
                text: textsForLang.exercise.macoutTutorial.des6,
            },
            {
                elId: 'chat-box',
                title: textsForLang.exercise.macoutTutorial.title7,
                text: textsForLang.exercise.macoutTutorial.des7,
            },
        ];

        let currentStep = 0;
        const mascot = document.getElementById('mascout');
        const tooltip = document.getElementById('tooltip');
        const overlay = document.getElementById('tutorial-overlay');
        if (!mascot || !tooltip || !overlay) return;

        const goStep = (index: number) => {
            currentStep = index;
            if (index >= steps.length) return hideTutorial();
            const step = steps[index];
            if (!step) return;

            gsap.to(overlay, { opacity: 0.4, pointerEvents: 'auto', duration: 0.4 });

            if (step.elId) {
                const el = document.getElementById(step.elId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const top = rect.top + window.scrollY - 60;
                    const left = rect.left + rect.width / 2 - 32;
                    gsap.to(mascot, { top, left, opacity: 1, duration: 0.6, ease: 'power2.out' });
                    gsap.to(tooltip, {
                        top: top - 40,
                        left: left + 48,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                    });
                }
            }

            tooltip.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-lg">${step.title}</h3>
                <button id="close-tutorial" class="cursor-pointer text-red-500 font-bold hover:text-red-700">X</button>
                </div>
                <p class="text-gray-700 mt-1">${step.text}</p>
                <div class="flex justify-between mt-4">
                <button id="prev-step" class="px-3 py-1 bg-[#5ae6ff] rounded-l-full cursor-pointer hover:bg-[#5ae6ff]/20 text-white transition">${textsForLang.exercise.macoutTutorial.back}</button>
                <button id="next-step" class="px-3 py-1 bg-[#A5C347] text-white cursor-pointer rounded-r-full hover:bg-[#A5C347]/20 transition">${index === steps.length - 1 ? textsForLang.exercise.macoutTutorial.finish : textsForLang.exercise.macoutTutorial.next}</button>
                </div>
            `;

            document.getElementById('prev-step')?.addEventListener('click', () => {
                if (currentStep > 0) goStep(currentStep - 1);
            });
            document.getElementById('next-step')?.addEventListener('click', () => {
                if (currentStep < steps.length - 1) goStep(currentStep + 1);
                else hideTutorial();
            });
            document.getElementById('close-tutorial')?.addEventListener('click', hideTutorial);
        };

        const hideTutorial = () =>
            gsap.to([mascot, tooltip, overlay], {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.4,
            });

        goStep(0);

        return { goStep: () => goStep(0) };
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    // const [problemFile, setProblemFile] = useState<File | null>(null);
    const [problemFiles, setProblemFiles] = useState<File[]>([]);
    const [problemProgress, setProblemProgress] = useState<Record<string, number>>({});

    const [solutionFiles, setSolutionFiles] = useState<File[]>([]);
    // const [problemProgress, setProblemProgress] = useState(0);
    const [solutionProgress, setSolutionProgress] = useState<Record<string, number>>({});

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const handleFileUpload = (file: File, type: 'problem' | 'solution') => {
        // Khởi tạo progress = 0
        if (type === 'problem') {
            setProblemProgress((prev) => ({ ...prev, [file.name]: 0 }));
        } else {
            setSolutionProgress((prev) => ({ ...prev, [file.name]: 0 }));
        }

        // progressSetter luôn nhận 1 số và cập nhật đúng object
        const progressSetter = (val: number) => {
            if (type === 'problem') {
                setProblemProgress((prev) => ({ ...prev, [file.name]: val }));
            } else {
                setSolutionProgress((prev) => ({ ...prev, [file.name]: val }));
            }
        };

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) progress = 100;
            progressSetter(progress); // ✅ Luôn cập nhật object
            animateMascotProgress(progress, type);

            if (progress === 100) {
                const mascot = document.getElementById('mascout');
                if (mascot) mascot.style.backgroundImage = "url('/mascoutimgs/finished.png')";
                clearInterval(interval);
            }
        }, 200);
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'problem' | 'solution',
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'problem') {
            const newFiles = Array.from(files).filter(Boolean) as File[];
            setProblemFiles((prev) => {
                const combined = [...prev, ...newFiles].slice(0, 2); // giới hạn 2 file
                combined.forEach((f) => handleFileUpload(f, 'problem'));
                return combined;
            });
        } else {
            const newFiles = Array.from(files).filter(Boolean) as File[]; // ✅ Chắc chắn không undefined
            setSolutionFiles((prev) => {
                const combined = [...prev, ...newFiles].slice(0, 8); // giới hạn 8 file
                combined.forEach((f) => handleFileUpload(f, 'solution'));
                return combined;
            });
        }
    };

    const handleCancelFile = (type: 'problem' | 'solution', fileName?: string) => {
        if (type === 'problem' && fileName) {
            setProblemFiles((prev) => prev.filter((f) => f.name !== fileName));
            setProblemProgress((prev) => {
                const updated = { ...prev };
                delete updated[fileName];
                return updated;
            });
        } else if (type === 'solution' && fileName) {
            setSolutionFiles((prev) => prev.filter((f) => f.name !== fileName));
            setSolutionProgress((prev) => {
                const updated = { ...prev };
                delete updated[fileName];
                return updated;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const notice = textsForLang.exercise.macoutTutorial.notice;
        const isChooseGrade = textsForLang.exercise.macoutTutorial.isChooseGrade;
        const isChooseSubject = textsForLang.exercise.macoutTutorial.isChooseSubject;
        console.log(isChooseGrade, isChooseSubject);

        if (!selectedClass || !selectedSubject) {
            showMascotReminder(notice, selectedClass ? isChooseSubject : isChooseGrade);
            return;
        }

        if (problemFiles.length === 0 || solutionFiles.length === 0) return;
        if (
            Object.values(problemProgress).some((p) => p < 100) ||
            Object.values(solutionProgress).some((p) => p < 100)
        )
            return;

        setLoading(true);
        setMessages((prev) => [
            ...prev,
            { text: `Đang gửi bài tập và ${solutionFiles.length} file đáp án...`, sender: 'user' },
        ]);

        try {
            const formData = new FormData();
            problemFiles.forEach((f, idx) => {
                const renamed = new File([f], `de-bai-${idx + 1}.${f.name.split('.').pop()}`);
                formData.append('problems', renamed);
            });
            solutionFiles.forEach((f, idx) => {
                const renamed = new File([f], `bai-lam-${idx + 1}.${f.name.split('.').pop()}`);
                formData.append('solutions', renamed);
            });

            formData.append('class', selectedClass);
            formData.append('subject', selectedSubject);

            const response = await fetch('/api/ai-submit', { method: 'POST', body: formData });
            const data = await response.json();
            setMessages((prev) => [...prev, { text: data.text, sender: 'bot' }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { text: 'Something went wrong', sender: 'bot' }]);
        } finally {
            setLoading(false);
            const mascot = document.getElementById('mascout');
            if (mascot) mascot.style.backgroundImage = "url('/mascoutimgs/image-part-16-r3c2.png')";

            // ✅ Reset các khung upload
            setProblemFiles([]);
            setSolutionFiles([]);
            setProblemProgress({});
            setSolutionProgress({});

            // Nếu bạn muốn reset input HTML file (tránh vẫn giữ file cũ trong UI)
            const problemInput = document.querySelector<HTMLInputElement>(
                '#problem-upload input[type="file"]',
            );
            if (problemInput) problemInput.value = '';

            const solutionInput = document.querySelector<HTMLInputElement>(
                '#solution-upload input[type="file"]',
            );
            if (solutionInput) solutionInput.value = '';
        }
    };

    useEffect(() => {
        (
            window as typeof window & {
                practiceTutorialController?: ReturnType<typeof animateTutorial>;
            }
        ).practiceTutorialController = animateTutorial();
    }, [textsForLang]);

    return (
        <div className="flex flex-col gap-6 ">
            {/* --- Chọn lớp / môn --- */}
            <div className="flex gap-4 justify-center mb-4">
                <div className="flex flex-col">
                    <label htmlFor="class-select" className="font-semibold mb-1">
                        {textsForLang.exercise.submitForm.chooseGrade.title}
                    </label>
                    <select
                        id="class-select"
                        className="border px-2 py-2 rounded-lg min-w-[200]"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">
                            -- {textsForLang.exercise.submitForm.chooseGrade.title} --
                        </option>
                        <option value="6">
                            {textsForLang.exercise.submitForm.chooseGrade.option1}
                        </option>
                        <option value="7">
                            {textsForLang.exercise.submitForm.chooseGrade.option2}
                        </option>
                        <option value="8">
                            {textsForLang.exercise.submitForm.chooseGrade.option3}
                        </option>
                        <option value="9">
                            {textsForLang.exercise.submitForm.chooseGrade.option4}
                        </option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="subject-select" className="font-semibold mb-1">
                        {textsForLang.exercise.submitForm.chooseSubject.title}
                    </label>
                    <select
                        id="subject-select"
                        className="border px-4 py-2 rounded-lg min-w-[200]"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">
                            -- {textsForLang.exercise.submitForm.chooseSubject.title} --
                        </option>
                        <option value="van">
                            {textsForLang.exercise.submitForm.chooseSubject.option1}
                        </option>
                        <option value="toan">
                            {textsForLang.exercise.submitForm.chooseSubject.option2}
                        </option>
                        <option value="anh">
                            {textsForLang.exercise.submitForm.chooseSubject.option3}
                        </option>
                    </select>
                </div>
            </div>
            <div className="flex gap-6 ">
                {/* --- Upload problem / solution --- */}
                <div className="flex w-1/3">
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:flex md:flex-col gap-4 relative z-10 md:flex-1  md:mb-12 mb-12"
                    >
                        {/* Problem Upload */}
                        <div className="flex flex-col gap-2 ">
                            <span className="font-semibold text-lg justify-between flex">
                                {textsForLang.exercise.submitForm.uploadFile.title}
                                <span className="text-sm text-gray-500">
                                    ({problemFiles.length}/2)
                                </span>
                            </span>
                            <div
                                id="problem-upload"
                                className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e, 'problem')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading || solutionFiles.length >= 8}
                                />
                                {problemFiles.length > 0 ? (
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                        {problemFiles.map((file) => (
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
                                                            handleCancelFile('problem', file.name);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer bg-gray-200 rounded-full p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${problemProgress[file.name] || 0}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-center block">
                                        {textsForLang.exercise.submitForm.uploadFile.titledes}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Solution Upload */}
                        <div className="flex flex-col gap-3">
                            <span className="font-semibold text-lg flex justify-between">
                                {textsForLang.exercise.submitForm.uploadSolution.title}
                                <span className="text-sm text-gray-500">
                                    ({solutionFiles.length}/8)
                                </span>
                            </span>
                            <div
                                id="solution-upload"
                                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition bg-white"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e, 'solution')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading || solutionFiles.length >= 8}
                                />
                                {solutionFiles.length > 0 ? (
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                        {solutionFiles.map((file) => (
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
                                                            handleCancelFile('solution', file.name);
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
                                                            width: `${solutionProgress[file.name] || 0}%`,
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
                                problemFiles.length === 0 ||
                                solutionFiles.length === 0 ||
                                Object.values(problemProgress).some((p) => p < 100) ||
                                Object.values(solutionProgress).some((p) => p < 100)
                            }
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {textsForLang.exercise.submitForm.submit.title}
                        </button>
                    </form>
                </div>
                {/* --- Messages / chat --- */}
                <div
                    id="chat-box"
                    className="flex-1 w-2/3 overflow-y-auto h-[560px] p-4 bg-gray-100 border-2 border-[#B1C74D] rounded-2xl shadow-inner space-y-3 relative"
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                                    msg.sender === 'user'
                                        ? 'bg-green-200 text-gray-800 rounded-br-none'
                                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div
                                        className="whitespace-pre-line"
                                        dangerouslySetInnerHTML={{
                                            __html: msg.text
                                                .replace(/\[PAR\]/g, '<></>') // ngắt đoạn
                                                .replace(/\[LINE\]/g, '<></>'), // xuống dòng
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessages((prev) => prev.filter((_, i) => i !== idx));
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-12 h-12 bg-no-repeat bg-contain"
                                style={{
                                    backgroundImage: "url('/mascoutimgs/image-part-16-r3c2.png')",
                                }}
                            />
                            <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-gray-200 text-gray-500 animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* mascout */}
            <div
                id="mascout"
                className="absolute z-50 w-16 h-16 bg-no-repeat bg-contain"
                style={{
                    backgroundImage: "url('/mascoutimgs/image-part-16-r3c2.png')",
                    top: 0,
                    left: 0,
                    opacity: 0,
                }}
            />
            <div
                id="tooltip"
                className="absolute bg-white py-4 px-6 rounded-lg shadow-lg max-w-md z-50 opacity-0 pointer-events-auto"
            />
            <div
                id="tutorial-overlay"
                className="absolute inset-0 bg-black/40 z-40 pointer-events-none opacity-0 transition-opacity"
            />
        </div>
    );
}

// --- Helper truncate tên file ---
const truncateFileName = (name: string, maxLength = 12) => {
    const dotIndex = name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? name.slice(dotIndex) : '';
    const base = dotIndex !== -1 ? name.slice(0, dotIndex) : name;
    if (base.length > maxLength) {
        return base.slice(0, maxLength) + '...' + ext;
    }
    return name;
};
