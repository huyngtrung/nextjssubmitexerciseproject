'use client';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

/**
 * Chỉ đánh letter by letter 1 lần (dùng cho <p> hoặc span)
 */
export function animateTypewriterOnce(selector: string) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const text = el.textContent || '';
        el.textContent = '';
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
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

/**
 * Đánh chữ kiểu loop: Explore -> The Magical Space -> The Galaxy
 * selector: class cha chứa các span typewriter-text
 * words: danh sách từ sẽ loop
 */
export function animateTypewriterLoop(selector: string, words: string[]) {
    const container = document.querySelector<HTMLElement>(selector);
    if (!container) return;

    const span = container.querySelector<HTMLElement>('.typewriter-text');
    if (!span) return;

    const colors = ['from-[#8DA4EA] to-white', 'from-[#F6C667] to-white']; // màu theo từ

    const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    words.forEach((word, index) => {
        const tl = gsap.timeline({ repeat: 0 });

        // Xóa chữ cũ
        tl.to(span, { duration: 0.3, text: '', ease: 'none' });

        // Thay đổi màu chữ cho từ hiện tại
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

        masterTl.add(tl);
    });

    gsap.to('.cursor', { opacity: 0, ease: 'power2.inOut', repeat: -1, duration: 0.5 });
}
