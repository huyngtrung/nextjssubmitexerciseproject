'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { UserButtonFlower } from './UserButtonFlower';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { FileTextIcon, MenuIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type Lang = 'vi' | 'en';

const texts = {
    vi: {
        navbarAdmin: {
            home: 'Trang Chủ',
            dashboard: 'Tổng Quan',
            classrooms: 'Lớp Học',
            students: 'Học Sinh',
            exercises: 'Bài Tập',
        },
    },
    en: {
        navbarAdmin: {
            home: 'Home',
            dashboard: 'Dashboard',
            classrooms: 'Classrooms',
            students: 'Students',
            exercises: 'Exercises',
        },
    },
} as const;

export default function NavbarAdmin() {
    const pathname = usePathname();
    const router = useRouter();

    const lang = (pathname.split('/')[1] as Lang) || 'en';
    const textsForLang = texts[lang] ?? texts.en;

    const switchLang = () => {
        const newLang = lang === 'vi' ? 'en' : 'vi';
        const restPath = pathname.split('/').slice(2).join('/');
        router.push(`/${newLang}/${restPath || 'admin'}`);
    };

    const navLinks = [
        {
            href: `/vi`,
            label: textsForLang.navbarAdmin.home,
            color: '#A3C046',
            icon: <FileTextIcon />,
        },
        {
            href: `/${lang}/admin`,
            label: textsForLang.navbarAdmin.dashboard,
            color: '#EC2265',
            icon: <FileTextIcon />,
        },
        {
            href: `/${lang}/admin/classrooms`,
            label: textsForLang.navbarAdmin.classrooms,
            color: '#00D2DC',
            icon: <FileTextIcon />,
        },
        {
            href: `/${lang}/admin/students`,
            label: textsForLang.navbarAdmin.students,
            color: '#EE6C00',
            icon: <FileTextIcon />,
        },
        {
            href: `/${lang}/admin/exercises`,
            label: textsForLang.navbarAdmin.exercises,
            color: '#756DF5',
            icon: <FileTextIcon />,
        },
    ];

    return (
        <header className="flex z-20 py-8 top-0 w-full transition-colors duration-300 bg-transparent">
            <nav className="flex justify-center items-center gap-4 container md:mx-48 mx-4 px-8 py-4 bg-black/70 backdrop-blur-xs rounded-full border-2 border-gray-300 shadow-lg shadow-white/20">
                <Suspense fallback={null}>
                    {/* Desktop language button */}
                    <Button
                        onClick={switchLang}
                        className="hidden border-2 border-[#8800FF] bg-transparent/50 cursor-pointer p-1 rounded-full lg:flex items-center justify-center w-10 h-10"
                    >
                        <Image
                            src={`/languageImgs/${lang === 'vi' ? 'vietnam' : 'united-kingdom'}.png`}
                            alt={lang === 'vi' ? 'Vietnam' : 'English'}
                            width={32}
                            height={32}
                        />
                    </Button>

                    {/* Logo */}
                    <Link
                        className="hidden md:flex animate-slide-up mr-auto text-lg items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                        href="/"
                    >
                        Logo
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-semibold text-md animate-slide-up flex items-center justify-center px-2
                                            opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out
                                            hover:-translate-y-1 hover:scale-105 relative min-w-[96]"
                                    style={{
                                        color: link.color,
                                        borderBottom: isActive
                                            ? `2px solid ${link.color}`
                                            : '2px solid transparent',
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="hidden md:flex items-center gap-6"></div>
                        <SignedIn>
                            <div className="hidden md:flex items-center gap-6">
                                <UserButtonFlower />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <Button
                                className="self-center border-[#F1C21B] border-2 bg-transparent text-[#F1C21B]/90 font-semibold cursor-pointer hover:bg-black hover:text-[#F1C21B]/90 min-w-[120px] px-3"
                                asChild
                            >
                                {/* <SignInButton>{texts.layout.nav.signIn}</SignInButton> */}
                            </Button>
                        </SignedOut>
                    </div>

                    {/* Mobile nav */}
                    <div className="flex lg:hidden items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                            {/* Mobile language */}
                            <Button
                                onClick={switchLang} // dùng router.push giống desktop
                                className="border-2 border-[#8800FF] bg-transparent/50 cursor-pointer p-1 rounded-full flex items-center justify-center w-10 h-10"
                            >
                                <Image
                                    src={`/languageImgs/${lang === 'vi' ? 'vietnam' : 'united-kingdom'}.png`}
                                    alt={lang === 'vi' ? 'Vietnam' : 'English'}
                                    width={32}
                                    height={32}
                                />
                            </Button>
                            <Link
                                className="flex md:hidden animate-slide-up mr-auto text-lg items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/"
                            >
                                Logo
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <MenuIcon className="cursor-pointer text-accent" />
                                </SheetTrigger>
                                <SheetContent className="bg-white">
                                    <SheetHeader>
                                        <SheetTitle className="text-3xl">
                                            {/* {texts.layout.nav.mobileNav.title} */}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {/* {texts.layout.nav.mobileNav.Des} */}
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="grid flex-1 auto-rows-min border-t-2 border-[#A5C347] bg-white">
                                        {navLinks.map((link, index) => (
                                            <Button
                                                key={link.href}
                                                className={`font-semibold justify-start text-lg opacity-75 bg-white/90 rounded-none py-8 border-b-2 ${
                                                    index === 0
                                                        ? 'text-[#A5C347]'
                                                        : index === 1
                                                          ? 'text-[#EC2265]'
                                                          : 'text-[#00D2DC]'
                                                }`}
                                                asChild
                                            >
                                                <Link href={link.href}>
                                                    {link.icon} {link.label}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>

                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button variant="outline">
                                                {/* {texts.layout.nav.mobileNav.close} */}
                                            </Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>

                            <SignedOut>
                                <Button
                                    className="self-center text-xs border-[#F1C21B] border-2 bg-transparent text-[#F1C21B]/90 font-semibold cursor-pointer hover:bg-black hover:text-[#F1C21B]/90 min-w-[100px] px-1"
                                    asChild
                                >
                                    {/* <SignInButton>{texts.layout.nav.signIn}</SignInButton> */}
                                </Button>
                            </SignedOut>

                            <SignedIn>
                                <div className="size-8 self-center">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: {
                                                    width: '100%',
                                                    height: '100%',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </Suspense>
            </nav>
        </header>
    );
}
