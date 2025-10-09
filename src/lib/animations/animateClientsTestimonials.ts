import gsap from 'gsap';

// Animate card + quote + client image on select
export const animateClients = (selectedId: number) => {
    const selectedEl = document.querySelector<HTMLElement>(`.client-img[data-id="${selectedId}"]`);
    const selectedColor = selectedEl?.getAttribute('data-color') || '#f1aa00';

    // Card background
    const card = document.querySelector<HTMLElement>('.testimonial-card');
    if (card) gsap.to(card, { backgroundColor: selectedColor, duration: 0.2, ease: 'power2.out' });

    // Quote icon border & svg fill
    const quote = document.querySelector<HTMLElement>('.quote-icon');
    if (quote) {
        gsap.to(quote, { borderColor: selectedColor, duration: 0.2, ease: 'power2.out' });
        const svg = quote.querySelector<SVGElement>('svg');
        if (svg) gsap.to(svg, { fill: selectedColor, duration: 0.2, ease: 'power2.out' });
    }

    // Borders of client images
    document.querySelectorAll<HTMLElement>('.client-img').forEach((img) => {
        const id = img.getAttribute('data-id');
        gsap.to(img, {
            borderColor: id === selectedId.toString() ? selectedColor : 'transparent',
            duration: 0.2,
            ease: 'power2.out',
        });
    });
};

// Scroll animations for fade + blur
export const initScrollAnimations = () => {
    const elements = document.querySelectorAll<HTMLElement>('.scroll-animate');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target as HTMLElement;
                if (entry.isIntersecting) {
                    gsap.to(el, {
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: 0.8,
                        ease: 'power2.out',
                    });
                } else {
                    gsap.set(el, { opacity: 0, filter: 'blur(10px)' });
                }
            });
        },
        { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));
};
