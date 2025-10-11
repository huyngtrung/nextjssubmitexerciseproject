'use client';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

// Lưu timeline loop toàn cục để kill khi cần
let loopTimeline: GSAPTimeline | null = null;

/**
 * Chỉ đánh letter by letter 1 lần (dùng cho <p> hoặc span)
 */
export function animateTypewriterOnce(selector: string) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        // Xóa nội dung cũ
        el.textContent = '';

        const text = el.dataset.text || el.textContent || '';
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.classList.add('inline');
            if (el.tagName === 'SPAN') {
                span.textContent = char === ' ' ? '\u00A0' : char;
            } else {
                span.textContent = char;
            }
            span.style.opacity = '0';
            el.appendChild(span);
        });

        gsap.to(el.querySelectorAll('span'), {
            opacity: 1,
            duration: 0.05,
            stagger: 0.05,
            ease: 'none',
        });
    });
}

export function animateTypewriterLoop(selector: string, words: string[]) {
    const container = document.querySelector<HTMLElement>(selector);
    if (!container) return;

    const span = container.querySelector<HTMLElement>('.typewriter-text');
    if (!span) return;

    // Kill timeline cũ nếu có
    if (loopTimeline) {
        loopTimeline.kill();
        loopTimeline = null;
    }

    // Reset nội dung chữ
    span.textContent = '';

    const colors = ['from-[#8DA4EA] to-white', 'from-[#F6C667] to-white'];

    loopTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    words.forEach((word, index) => {
        const tl = gsap.timeline();

        // Xóa chữ cũ
        tl.to(span, { duration: 0.3, text: '', ease: 'none' });

        // Thay đổi màu chữ
        tl.add(() => {
            span.className = `typewriter-text bg-gradient-to-b ${colors[index] ?? 'from-[#8DA4EA] to-white'} bg-clip-text text-transparent`;
        });

        // Đánh chữ letter-by-letter
        tl.to(span, {
            duration: word.length * 0.1,
            text: word,
            ease: 'steps(' + word.length + ')',
        });

        // Giữ nguyên 3s
        tl.to({}, { duration: 3 });

        loopTimeline!.add(tl);
    });

    gsap.to('.cursor', { opacity: 0, ease: 'power2.inOut', repeat: -1, duration: 0.5 });

    return loopTimeline;
}
