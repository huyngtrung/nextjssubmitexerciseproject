import gsap from 'gsap';

export const rotateFlower = (element: HTMLElement | null, duration = 8) => {
    if (!element) return;

    gsap.to(element, {
        rotate: 360,
        duration,
        repeat: -1,
        ease: 'linear',
        transformOrigin: 'center center',
    });
};
