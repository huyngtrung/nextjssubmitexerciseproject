import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

// Mascot chạy theo thanh load và rung rung
export const animateMascotProgress = (progress: number, type: 'problem' | 'solution') => {
    const mascot = document.getElementById('mascout');
    const bar = document.getElementById(type === 'problem' ? 'problem-upload' : 'solution-upload');
    if (!mascot || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const x = barRect.left + barRect.width * (progress / 100) - 32 + window.scrollX;
    const y = barRect.top + window.scrollY - 60;
    const jump = (progress % 10) - 5;
    gsap.to(mascot, { x, y: y - jump, duration: 0.2, ease: 'power1.inOut' });
};

// Hiển thị mascot nhắc nhở khi chưa chọn lớp/môn
export const showMascotReminder = (text: string) => {
    const mascot = document.getElementById('mascout');
    const tooltip = document.getElementById('tooltip');
    const overlay = document.getElementById('tutorial-overlay');
    if (!mascot || !tooltip || !overlay) return;

    gsap.to([mascot, tooltip, overlay], { opacity: 1, duration: 0.4, pointerEvents: 'auto' });
    gsap.set(mascot, {
        top: window.innerHeight / 2 - 40,
        left: window.innerWidth / 2 - 40,
        backgroundImage: "url('/mascoutimgs/reminder.png')",
    });
    tooltip.innerHTML = `<div class="font-bold text-lg mb-2">Nhắc nhở!</div><p class="text-gray-700">${text}</p>`;
    gsap.to([mascot, tooltip], { opacity: 1, duration: 0.4 });
    setTimeout(() => {
        gsap.to([mascot, tooltip, overlay], { opacity: 0, duration: 0.4, pointerEvents: 'none' });
    }, 3000);
};

// Tutorial hướng dẫn các ô chọn lớp/môn/file/submit
export const animateTutorial = () => {
    const mascot = document.getElementById('mascout');
    const tooltip = document.getElementById('tooltip');
    const overlay = document.getElementById('tutorial-overlay');
    if (!mascot || !tooltip || !overlay) return;

    const steps = [
        { el: null, title: 'Hello!', text: 'I am the mascot here to guide you.' },
        {
            elId: 'class-select',
            title: 'Select Class',
            text: 'Please choose the class that suits you.',
        },
        {
            elId: 'subject-select',
            title: 'Select Subject',
            text: 'Choose the subject you want to submit your assignment for.',
        },
        {
            elId: 'problem-upload',
            title: 'Upload Assignment File',
            text: 'Click or drag your assignment file here.',
        },
        {
            elId: 'solution-upload',
            title: 'Upload Solution File',
            text: 'Click or drag your completed work file here.',
        },
        {
            elId: 'submit-btn',
            title: 'Submit',
            text: 'Once the files are uploaded, click Submit to send them.',
        },
        { elId: 'chat-box', title: 'AI Results', text: 'View AI explanations and feedback here.' },
        { el: null, title: 'Goodbye!', text: 'Wish you a great learning experience!' },
    ];

    let currentStep = 0;

    const goStep = (stepIndex: number) => {
        currentStep = stepIndex;
        if (stepIndex >= steps.length) return hideTutorial();
        const step = steps[stepIndex];
        if (!step) return;

        gsap.to(overlay, { duration: 0.4, opacity: 0.4, pointerEvents: 'auto' });

        if (step.elId) {
            const el = document.getElementById(step.elId);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const scrollTop = window.scrollY + rect.top - 300; // offset 100px
            gsap.to(window, { scrollTo: scrollTop, duration: 0.6, ease: 'power2.inOut' });

            const top = rect.top + window.scrollY - 60;
            const left = rect.left + rect.width / 2 - 32;
            gsap.to(mascot, { duration: 0.6, top, left, opacity: 1, ease: 'power2.out' });

            const tooltipLeft =
                left + rect.width + 10 > window.innerWidth
                    ? rect.left - 220
                    : rect.left + rect.width + 10;
            const tooltipTop = top - 40;
            gsap.to(tooltip, {
                duration: 0.6,
                top: tooltipTop,
                left: tooltipLeft,
                opacity: 1,
                ease: 'power2.out',
            });
        } else {
            gsap.to(mascot, {
                duration: 0.6,
                top: window.innerHeight - 120,
                left: 40,
                opacity: 1,
                ease: 'power2.out',
            });
            gsap.to(tooltip, {
                duration: 0.6,
                top: window.innerHeight - 140,
                left: 80,
                opacity: 1,
                ease: 'power2.out',
            });
        }

        tooltip.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-lg">${step.title}</h3>
            <button id="close-tutorial" class="cursor-pointer text-red-500 font-bold hover:text-red-700">X</button>
        </div>
        <p class="text-gray-700 mt-1">${step.text}</p>
        <div class="flex justify-between mt-4">
            <button id="prev-step" class="px-3 py-1 bg-[#5ae6ff] rounded-l-full cursor-pointer hover:bg-[#5ae6ff]/20 text-white transition">Back</button>
            <button id="next-step" class="px-3 py-1 bg-[#A5C347] text-white cursor-pointer rounded-r-full hover:bg-[#A5C347]/20 transition">${stepIndex === steps.length - 1 ? 'Finish' : 'Next'}</button>
        </div>`;

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
        gsap.to([mascot, tooltip, overlay], { duration: 0.4, opacity: 0, pointerEvents: 'none' });

    goStep(0);

    return {
        goStep: () => {
            gsap.to([mascot, tooltip, overlay], {
                duration: 0.4,
                opacity: 1,
                pointerEvents: 'auto',
            });
            goStep(0);
        },
    };
};
