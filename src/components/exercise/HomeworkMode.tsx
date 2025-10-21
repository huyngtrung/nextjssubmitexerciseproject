'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { ExercisePageTexts } from '../ExerciseClient';
import { UserRole } from '@/drizzle/schema/user';
gsap.registerPlugin(ScrollToPlugin);

type Message = { text: string; sender: 'user' | 'bot' };

interface HomeWorkModeProps {
    textsForLang: ExercisePageTexts;
    userExercise: {
        id: string | undefined;
        role: UserRole | undefined;
        name: string | undefined | null;
        clerkUserId: string | null;
    };
}

export default function HomeWorkMode({ textsForLang, userExercise }: HomeWorkModeProps) {
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
    const [problemFile, setProblemFile] = useState<File | null>(null);
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [problemProgress, setProblemProgress] = useState(0);
    const [solutionProgress, setSolutionProgress] = useState(0);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const handleFileUpload = (file: File, type: 'problem' | 'solution') => {
        const progressSetter = type === 'problem' ? setProblemProgress : setSolutionProgress;
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) progress = 100;
            progressSetter(progress);
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
        const file = e.target.files?.[0] || null;
        if (file) {
            if (type === 'problem') {
                setProblemFile(file);
                setProblemProgress(0);
            } else {
                setSolutionFile(file);
                setSolutionProgress(0);
            }
            handleFileUpload(file, type);
        }
    };

    const handleCancelFile = (type: 'problem' | 'solution') => {
        if (type === 'problem') {
            setProblemFile(null);
            setProblemProgress(0);
        } else {
            setSolutionFile(null);
            setSolutionProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const notice = textsForLang.exercise.macoutTutorial.notice;
        const isChooseGrade = textsForLang.exercise.macoutTutorial.isChooseGrade;
        const isChooseSubject = textsForLang.exercise.macoutTutorial.isChooseSubject;

        if (!selectedClass || !selectedSubject) {
            showMascotReminder(notice, selectedClass ? isChooseSubject : isChooseGrade);
            return;
        }

        if (!problemFile || !solutionFile) return;
        if (problemProgress < 100 || solutionProgress < 100) return;

        setLoading(true);
        setMessages((prev) => [
            ...prev,
            { text: `Đang gửi: ${problemFile.name} và ${solutionFile.name}`, sender: 'user' },
        ]);

        try {
            const formData = new FormData();
            formData.append('problem', problemFile);
            formData.append('solution', solutionFile);
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
        }
    };

    // useEffect(() => {
    //     (window as any).practiceTutorialController = animateTutorial();
    // }, [textsForLang]);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-4 w-full">
                {!userExercise ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            {textsForLang.exercise.title}
                        </h2>
                        <p className="text-gray-500">{textsForLang.exercise.description}</p>
                    </div>
                ) : userExercise.role === 'user' ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
                        <div className="md:flex gap-4 w-full">
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 md:flex md:flex-col gap-4 relative z-10 md:flex-1  md:mb-12 mb-12"
                            >
                                {/* Solution Upload */}
                                <div className="flex flex-col gap-2 w-full">
                                    <span className="font-semibold text-lg text-start">
                                        {textsForLang.exercise.submitForm.uploadSolution.title}
                                    </span>
                                    <div
                                        id="solution-upload"
                                        className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-green-400 transition"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'solution')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={loading}
                                        />
                                        {solutionFile ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700 font-medium">
                                                        {solutionFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelFile('solution')}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 relative">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${solutionProgress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-center block">
                                                {
                                                    textsForLang.exercise.submitForm.uploadSolution
                                                        .titledes
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    id="submit-btn"
                                    disabled={
                                        loading ||
                                        !problemFile ||
                                        !solutionFile ||
                                        problemProgress < 100 ||
                                        solutionProgress < 100
                                    }
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {textsForLang.exercise.submitForm.submit.title}
                                </button>
                            </form>
                            {/* Chat Box */}
                            <div
                                id="chat-box"
                                className="flex-1 overflow-y-auto h-[400px] p-4 bg-gray-100 border-2 border-[#B1C74D] rounded-2xl shadow-inner space-y-3"
                            >
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                                                msg.sender === 'user'
                                                    ? 'bg-green-200 text-gray-800 rounded-br-none'
                                                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-gray-200 text-gray-500 animate-pulse">
                                            Typing...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]  text-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            {textsForLang.exercise.title}
                        </h2>

                        <p className="text-gray-500">{textsForLang.exercise.description}</p>
                    </div>
                )}
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
