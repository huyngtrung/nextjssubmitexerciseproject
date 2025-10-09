// lib/animations/animateCourseCard.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate cards fade-in khi scroll vào viewport
 * @param sectionRef React Ref tới container chứa các card
 */
export function animateCards(sectionRef: React.RefObject<HTMLDivElement | null>) {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll<HTMLElement>('.card-fade-seq');
    if (!cards.length) return;

    // set initial state
    gsap.set(cards, { opacity: 0, y: 50 });

    // ScrollTrigger cho fade-in
    ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%', // bắt đầu khi top của section chạm 80% viewport
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                stagger: 0.15, // các card hiện theo thứ tự
                duration: 0.5,
                ease: 'power2.out',
            });
        },
        onLeaveBack: () => {
            // nếu muốn cuộn lên lại thì fade-out
            gsap.to(cards, {
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 0.5,
                ease: 'power2.out',
            });
        },
    });
}
