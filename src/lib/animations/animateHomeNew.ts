import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHomeNew = () => {
    if (typeof window === 'undefined') return;

    const container = document.querySelector('.home-new-container');
    if (!container) return;

    const cards = container.querySelectorAll('.room-main, .room-item');

    gsap.fromTo(
        cards,
        {
            scale: 0.8, // bắt đầu scale nhỏ nhẹ, không quá 0
            opacity: 0,
            transformOrigin: 'center center',
        },
        {
            scale: 1,
            opacity: 1,
            ease: 'power3.out', // mượt hơn power2
            stagger: 0.15, // giảm thời gian giữa các phần tử
            scrollTrigger: {
                trigger: container,
                start: 'top 80%', // bắt đầu khi top container chạm 80% viewport
                end: 'bottom 60%', // kéo dài đến khi bottom container chạm 60% viewport
                scrub: 0.5, // delay nhỏ, trơn tru hơn so với true
            },
        },
    );
};
