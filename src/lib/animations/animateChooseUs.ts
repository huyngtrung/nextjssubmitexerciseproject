// lib/animations/animateChooseUs.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateChooseUs = () => {
    // Animate toàn bộ container (cột chữ + ảnh)
    gsap.fromTo(
        '.chooseus-container',
        { autoAlpha: 0, y: 50 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.chooseus-container',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse', // scroll vào play, scroll ra reverse
            },
        },
    );

    // Animate cột chữ: header + paragraph
    gsap.fromTo(
        '.chooseus-text',
        { autoAlpha: 0, y: 30 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.chooseus-container',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );

    // Animate các icon
    gsap.fromTo(
        '.chooseus-icon',
        { autoAlpha: 0, y: 20 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.chooseus-container',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );

    // Animate ảnh bên phải
    gsap.fromTo(
        '.chooseus-image',
        { autoAlpha: 0, x: 50 },
        {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.chooseus-container',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );
};
