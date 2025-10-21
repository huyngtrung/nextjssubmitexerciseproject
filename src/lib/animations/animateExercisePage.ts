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
export const showMascotReminder = (title: string, text: string) => {
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
    tooltip.innerHTML = `<div class="font-bold text-lg mb-2">${title}!</div><p class="text-gray-700">${text}</p>`;
    gsap.to([mascot, tooltip], { opacity: 1, duration: 0.4 });
    setTimeout(() => {
        gsap.to([mascot, tooltip, overlay], { opacity: 0, duration: 0.4, pointerEvents: 'none' });
    }, 1000);
};

// Tutorial hướng dẫn các ô chọn lớp/môn/file/submit
export const animateTutorial = (
    steps: { elId: string | null; title: string; text: string }[],
    next: string,
    back: string,
    finish: string,
) => {
    const mascot = document.getElementById('mascout');
    const tooltip = document.getElementById('tooltip');
    const overlay = document.getElementById('tutorial-overlay');
    if (!mascot || !tooltip || !overlay) return;

    let currentStep = 0;

    const clearListeners = () => {
        const prevBtn = document.getElementById('prev-step');
        if (prevBtn) {
            const newPrev = prevBtn.cloneNode(true);
            prevBtn.replaceWith(newPrev);
        }

        const nextBtn = document.getElementById('next-step');
        if (nextBtn) {
            const newNext = nextBtn.cloneNode(true);
            nextBtn.replaceWith(newNext);
        }

        const closeBtn = document.getElementById('close-tutorial');
        if (closeBtn) {
            const newClose = closeBtn.cloneNode(true);
            closeBtn.replaceWith(newClose);
        }
    };

    const goStep = (stepIndex: number) => {
        currentStep = stepIndex;
        if (stepIndex >= steps.length) return hideTutorial();
        const step = steps[stepIndex];
        if (!step) return;

        gsap.to(overlay, { duration: 0.4, opacity: 0.4, pointerEvents: 'auto' });

        if (step.elId) {
            const el = document.getElementById(step.elId);
            if (el) {
                const rect = el.getBoundingClientRect();
                const isMobile = window.innerWidth < 768;

                if (isMobile) {
                    // 👉 Màn hình nhỏ: mascot đứng trên giữa thẻ
                    const mascotTop = window.scrollY + rect.top - 60;
                    const mascotLeft = rect.left + rect.width / 2;

                    gsap.to(window, {
                        scrollTo: window.scrollY + rect.top - window.innerHeight / 3,
                        duration: 0.6,
                        ease: 'power2.inOut',
                    });

                    gsap.to(mascot, {
                        duration: 0.6,
                        top: mascotTop,
                        left: mascotLeft,
                        opacity: 1,
                        ease: 'power2.out',
                    });

                    // Tooltip cách mascot 200px
                    gsap.to(tooltip, {
                        duration: 0.6,
                        top: mascotTop + 120, // cách mascot 200px
                        left: '50%',
                        x: '-50%',
                        width: '90%',
                        maxWidth: '360px',
                        padding: '1rem 1.5rem',
                        borderRadius: '1rem',
                        opacity: 1,
                        ease: 'power2.out',
                    });
                } else {
                    // 👉 Màn hình lớn: giữ nguyên logic desktop
                    const scrollTop = window.scrollY + rect.top - 300;
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
                }
            }
        } else {
            // Bước không có elId (Xin chào / Kết thúc)
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                const mascotTop = window.innerHeight / 2;

                gsap.to(mascot, {
                    duration: 0.6,
                    top: mascotTop,
                    left: '50%',
                    x: '-50%',
                    opacity: 1,
                    ease: 'power2.out',
                });
                gsap.to(tooltip, {
                    duration: 0.6,
                    top: mascotTop + 80, // cách mascot 200px
                    left: '50%',
                    x: '-50%',
                    width: '90%',
                    maxWidth: '400px',
                    padding: '1rem 1.25rem',
                    borderRadius: '1rem',
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
        }

        tooltip.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-lg">${step.title}</h3>
            <button id="close-tutorial" class="cursor-pointer text-red-500 font-bold hover:text-red-700">X</button>
        </div>
        <p class="text-gray-700 mt-1">${step.text}</p>
        <div class="flex justify-between mt-4">
            <button id="prev-step" class="px-3 py-1 bg-[#5ae6ff] rounded-l-full cursor-pointer hover:bg-[#5ae6ff]/20 text-white transition">${back}</button>
            <button id="next-step" class="px-3 py-1 bg-[#A5C347] text-white cursor-pointer rounded-r-full hover:bg-[#A5C347]/20 transition">${stepIndex === steps.length - 1 ? finish : next}</button>
        </div>`;

        clearListeners();

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
