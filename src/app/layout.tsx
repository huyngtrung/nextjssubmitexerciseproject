import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Varela_Round } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'sonner';

const varela = Varela_Round({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'AI submit Exercise',
    description: 'AI submit Exercise',
    icons: {
        icon: '/download.png',
        apple: '/download.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`antialiased ${varela.className}`} suppressHydrationWarning={true}>
                    <LanguageProvider>
                        {children}
                        <Toaster richColors position="top-right" />
                    </LanguageProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
