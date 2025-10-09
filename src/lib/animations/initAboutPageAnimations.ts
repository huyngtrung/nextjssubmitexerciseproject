import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initAboutPageAnimations = () => {
    const iconsEls = gsap.utils.toArray<HTMLElement>('.about-bg-icon');

    iconsEls.forEach((icon, i) => {
        // Float nhẹ lơ lửng, hoàn toàn độc lập
        const floatX = gsap.utils.random(-15, 15);
        const floatY = gsap.utils.random(-10, 10);
        const duration = gsap.utils.random(3, 6);

        gsap.to(icon, {
            x: floatX,
            y: floatY,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            duration,
        });

        // Scroll animation dùng fromTo với value cố định
        gsap.fromTo(
            icon,
            { y: 0, x: 0 },
            {
                y: 50 + i * 5, // vị trí cuối theo scroll
                x: gsap.utils.random(-8, 8),
                ease: 'none',
                scrollTrigger: {
                    trigger: '.scroll-container',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true, // scrub true để trôi theo scroll chính xác
                },
            },
        );
    });
};

export const SectionAboutPageAnimations = () => {
    // Cards Animation: mở ra từ chính giữa theo chiều dọc
    // gsap.from('.about-card', {
    //     opacity: 0,
    //     y: 50, // bắt đầu thấp hơn và nhảy lên
    //     duration: 0.8,
    //     stagger: 0.2, // các card xuất hiện liên tiếp
    //     ease: 'power3.out',
    //     scrollTrigger: {
    //         trigger: '.about-card',
    //         start: 'top 80%', // animation bắt đầu khi element gần xuất hiện
    //         end: 'bottom 60%',
    //         toggleActions: 'play reverse play reverse',
    //         markers: false,
    //     },
    // });

    // About Us Section: fade + gentle zoom
    // gsap.from('.about-section', {
    //     opacity: 0,
    //     scaleX: 0, // mở theo chiều ngang từ giữa
    //     scaleY: 0, // mở theo chiều dọc từ giữa
    //     transformOrigin: 'center center', // bắt đầu từ chính giữa
    //     duration: 1,
    //     ease: 'power2.out',
    //     scrollTrigger: {
    //         trigger: '.about-section',
    //         start: 'top 85%',
    //         toggleActions: 'play reverse play reverse',
    //         markers: false,
    //     },
    // });

    // Other Section: slide from left + subtle rotation
    gsap.fromTo(
        '.about-other',
        { opacity: 0, x: -120, rotation: -2 },
        {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-other',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );

    // Members Section: gentle pop + fade + subtle glow
    gsap.fromTo(
        '.about-members',
        {
            opacity: 0.3,
            y: 40,
            scale: 0.9,
            filter: 'brightness(0.9) drop-shadow(0 0 0px #FFAA00)',
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'brightness(1) drop-shadow(0 0 10px #FFAA00)',
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-members',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );

    // Quote / Carousel Section: smooth scale + fade + soft glow
    gsap.fromTo(
        '.about-quote',
        {
            opacity: 0,
            scale: 0.9,
            rotation: -1,
            skewX: 1,
            filter: 'brightness(0.9) drop-shadow(0 0 0px #FF236C)',
        },
        {
            opacity: 1,
            scale: 1,
            rotation: 0,
            skewX: 0,
            filter: 'brightness(1) drop-shadow(0 0 15px #FF236C)',
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-quote',
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
            },
        },
    );
};
