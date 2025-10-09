import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateBackgroundShapes = (container: HTMLElement | null) => {
    if (!container) return;

    const shapes = container.querySelectorAll('.bg-shape');

    shapes.forEach((shape) => {
        // 1️⃣ Hiệu ứng float + xoay tự do
        const xFloat = gsap.utils.random(-40, 40); // biên độ X
        const yFloat = gsap.utils.random(-40, 40); // biên độ Y
        const rotateFloat = gsap.utils.random(-30, 30); // xoay

        gsap.to(shape, {
            x: `+=${xFloat}`,
            y: `+=${yFloat}`,
            rotation: rotateFloat,
            duration: gsap.utils.random(2, 5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    });
};
