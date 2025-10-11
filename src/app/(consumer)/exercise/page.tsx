'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowRightIcon, HelpCircle, X } from 'lucide-react';
import {
    animateMascotProgress,
    animateTutorial,
    showMascotReminder,
} from '@/lib/animations/animateExercisePage';
import { useLanguage } from '@/context/LanguageContext';

type Message = { text: string; sender: 'user' | 'bot' };

export default function ExercisePage() {
    const { texts } = useLanguage();

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [problemFile, setProblemFile] = useState<File | null>(null);
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [problemProgress, setProblemProgress] = useState(0);
    const [solutionProgress, setSolutionProgress] = useState(0);
    const [tutorialController, setTutorialController] = useState<ReturnType<
        typeof animateTutorial
    > | null>(null);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // Upload file và animation mascot theo thanh load
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

        const notice = texts.exercise.macoutTutorial.notice;
        const isChooseGrade = texts.exercise.macoutTutorial.isChooseGrade;
        const isChooseSubject = texts.exercise.macoutTutorial.isChooseSubject;

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

    useEffect(() => {
        // Nếu đã có tutorial cũ, ẩn nó trước
        tutorialController?.goStep?.(); // Hoặc ẩn tutorial trước khi tạo mới

        // Tạo steps dựa trên texts mới
        const steps = [
            {
                elId: null,
                title: texts.exercise.macoutTutorial.title1,
                text: texts.exercise.macoutTutorial.des1,
            },
            {
                elId: 'class-select',
                title: texts.exercise.macoutTutorial.title2,
                text: texts.exercise.macoutTutorial.des2,
            },
            {
                elId: 'subject-select',
                title: texts.exercise.macoutTutorial.title3,
                text: texts.exercise.macoutTutorial.des3,
            },
            {
                elId: 'problem-upload',
                title: texts.exercise.macoutTutorial.title4,
                text: texts.exercise.macoutTutorial.des4,
            },
            {
                elId: 'solution-upload',
                title: texts.exercise.macoutTutorial.title5,
                text: texts.exercise.macoutTutorial.des5,
            },
            {
                elId: 'submit-btn',
                title: texts.exercise.macoutTutorial.title6,
                text: texts.exercise.macoutTutorial.des6,
            },
            {
                elId: 'chat-box',
                title: texts.exercise.macoutTutorial.title7,
                text: texts.exercise.macoutTutorial.des7,
            },
            {
                elId: null,
                title: texts.exercise.macoutTutorial.title8,
                text: texts.exercise.macoutTutorial.des8,
            },
        ];
        const next = texts.exercise.macoutTutorial.next;
        const back = texts.exercise.macoutTutorial.back;
        const finish = texts.exercise.macoutTutorial.finish;

        const controller = animateTutorial(steps, next, back, finish);
        setTutorialController(controller);
    }, [texts]); // Re-run khi ngôn ngữ thay đổi

    return (
        <div className="relative flex flex-col items-center overflow-hidden  bg-gray-50 min-h-screen">
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
                            {texts.exercise.header.title}
                        </h1>
                        <div className="flex gap-3 text-lg justify-center items-center">
                            <Link href="/" className="hover:text-yellow-400 text-cyan-200">
                                {texts.layout.nav.home}
                            </Link>
                            <CircleArrowRightIcon /> {texts.layout.nav.exercise}
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

                {/* upload file */}
                <div className="w-full max-w-4xl px-4 flex flex-col justify-center gap-6 h-[140vh] md:h-[100vh]">
                    {/* header */}
                    <div className="py-8 text-center">
                        <div className="inline-block">
                            <h1 className=" text-2xl md:text-5xl font-bold mb-4">
                                {texts.exercise.submitForm.title}
                            </h1>
                            <div className="flex items-center justify-center w-full">
                                <div className="h-[2px] bg-[#B1C74D] flex-1"></div>
                                <div className="h-[6px] bg-[#B1C74D] w-1/3 rounded"></div>
                                <div className="h-[2px] bg-[#B1C74D] flex-1"></div>
                            </div>
                        </div>
                    </div>

                    {/* chọn lớp */}
                    <div className="flex gap-4 justify-center mb-4 relative">
                        <div className="flex flex-col relative ">
                            <label htmlFor="class-select" className="font-semibold mb-1">
                                {texts.exercise.submitForm.chooseGrade.title}
                            </label>
                            <select
                                id="class-select"
                                className="border px-4 py-2 rounded-lg min-w-[200]"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">
                                    -- {texts.exercise.submitForm.chooseGrade.title} --
                                </option>
                                <option value="6">
                                    {texts.exercise.submitForm.chooseGrade.option1}
                                </option>
                                <option value="7">
                                    {texts.exercise.submitForm.chooseGrade.option2}
                                </option>
                                <option value="8">
                                    {texts.exercise.submitForm.chooseGrade.option3}
                                </option>
                                <option value="9">
                                    {texts.exercise.submitForm.chooseGrade.option4}
                                </option>
                            </select>
                        </div>
                        <div className="flex flex-col relative">
                            <label htmlFor="subject-select" className="font-semibold mb-1">
                                {texts.exercise.submitForm.chooseSubject.title}
                            </label>
                            <select
                                id="subject-select"
                                className="border px-4  py-2 rounded-lg"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">
                                    -- {texts.exercise.submitForm.chooseSubject.title} --
                                </option>
                                <option value="van">
                                    {texts.exercise.submitForm.chooseSubject.option1}
                                </option>
                                <option value="toan">
                                    {texts.exercise.submitForm.chooseSubject.option2}
                                </option>
                                <option value="ly">
                                    {texts.exercise.submitForm.chooseSubject.option3}
                                </option>
                                <option value="hoa">
                                    {texts.exercise.submitForm.chooseSubject.option4}
                                </option>
                                <option value="anh">
                                    {texts.exercise.submitForm.chooseSubject.option5}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="md:flex gap-4">
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:flex md:flex-col gap-4 relative z-10 md:flex-1  md:mb-12 mb-12"
                        >
                            {/* Problem Upload */}
                            <div className="flex flex-col gap-2">
                                <span className="font-semibold text-lg">
                                    {texts.exercise.submitForm.uploadFile.title}
                                </span>
                                <div
                                    id="problem-upload"
                                    className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'problem')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={loading}
                                    />
                                    {problemFile ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-medium">
                                                    {problemFile.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelFile('problem')}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${problemProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-center block">
                                            {texts.exercise.submitForm.uploadFile.titledes}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Solution Upload */}
                            <div className="flex flex-col gap-2">
                                <span className="font-semibold text-lg">
                                    {texts.exercise.submitForm.uploadSolution.title}
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
                                                    style={{ width: `${solutionProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-center block">
                                            {texts.exercise.submitForm.uploadSolution.titledes}
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
                                {texts.exercise.submitForm.submit.title}
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

                {/* Help Button */}
                <button
                    onClick={() => tutorialController?.goStep()}
                    className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
                >
                    <HelpCircle size={24} />
                </button>

                {/* Overlay + Mascot + Tooltip */}
                <div
                    id="tutorial-overlay"
                    className="absolute inset-0 bg-black/40 z-40 pointer-events-none opacity-0 transition-opacity"
                />
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
                    className="absolute bg-white py-4 px-6 rounded-lg rounded-l-4xl shadow-lg max-w-md z-50 opacity-0 pointer-events-auto"
                />
            </div>
        </div>
    );
}
