'use client';
import { animatePageIn, animatePageOut } from '@/lib/animations/animatePageNavigation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? '';
    const router = useRouter();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (!target || target === pathname) return;
            e.preventDefault();
            animatePageOut(target, router);
        };

        const links = Array.from(document.querySelectorAll('a'));
        links.forEach((link) => link.addEventListener('click', handleClick));

        return () => {
            links.forEach((link) => link.removeEventListener('click', handleClick));
        };
    }, [pathname, router]);

    useEffect(() => {
        animatePageIn();
    }, [pathname]);

    return <>{children}</>;
}
