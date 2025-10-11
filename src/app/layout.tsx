// layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Varela_Round } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';

const varela = Varela_Round({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'AI submit Exercise',
    description: 'AI submit Exercise',
    icons: {
        icon: '/download.png', // icon mặc định
        apple: '/download.png', // nếu muốn hỗ trợ iOS
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`antialiased ${varela.className}`}>
                    <LanguageProvider>{children}</LanguageProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
