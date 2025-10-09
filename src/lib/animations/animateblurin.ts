// lib/animations/animateCourseCard.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateBlurIn(sectionRef: React.RefObject<HTMLDivElement | null>) {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll<HTMLElement>('.card-blur-in');
    if (!cards.length) return;

    // set initial state
    gsap.set(cards, { opacity: 0, y: 20, filter: 'blur(8px)' });

    // tạo ScrollTrigger riêng cho từng card
    cards.forEach((card) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.4,
                    ease: 'power2.out',
                });
            },
            onLeaveBack: () => {
                gsap.to(card, {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(8px)',
                    duration: 0.4,
                    ease: 'power2.out',
                });
            },
        });
    });
}
