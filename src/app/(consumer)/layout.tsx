'use client';

import { Button } from '@/components/ui/button';
import { UserButtonFlower } from '@/components/UserButtonFlower';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
// import {
//     DribbbleIcon,
//     FacebookIcon,
//     GithubIcon,
//     HomeIcon,
//     MailIcon,
//     PhoneIcon,
//     SchoolIcon,
//     SendIcon,
//     TwitterIcon,
// } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { BookIcon, FileTextIcon, HouseIcon, MenuIcon } from 'lucide-react';

export default function ConsumerLayout({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-x-hidden">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

function Navbar() {
    const { lang, setLang, texts } = useLanguage();
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: texts.layout.nav.home, color: '#A5C347' },
        { href: '/about', label: texts.layout.nav.about, color: '#FF236C' },
        { href: '/exercise', label: texts.layout.nav.exercise, color: '#00D2DC' },
        // { href: '/bookread', label: 'Library', color: '#00D2DC' },
        // { href: '/exercise', label: 'Exercise', color: '#8800FF' },
    ];

    return (
        <header
            className={`flex z-20 py-8 fixed top-0 w-full transition-colors duration-300 bg-transparent`}
        >
            <nav className="flex justify-center items-center gap-4 container md:mx-48 mx-4 px-8 py-4 bg-white/5 backdrop-blur-xs rounded-full border-2 border-gray-300 shadow-lg shadow-white/20">
                <Suspense fallback={null}>
                    <Button
                        onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                        className="hidden border-2 border-[#8800FF] bg-transparent/50 cursor-pointer p-1 rounded-full lg:flex items-center justify-center w-10 h-10"
                    >
                        <Image
                            src={`/languageImgs/${lang === 'vi' ? 'vietnam' : 'united-kingdom'}.png`}
                            alt={lang === 'vi' ? 'Vietnam' : 'English'}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </Button>
                    <Link
                        className=" hidden md:flex animate-slide-up mr-auto text-lg items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                        href="/"
                    >
                        Logo
                    </Link>

                    {/* table & moblie */}
                    <div className="hidden lg:flex items-center gap-4 ">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-semibold text-md animate-slide-up flex items-center justify-center px-2
                                            opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out
                                            hover:-translate-y-1 hover:scale-105 relative min-w-[94]"
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
                                className="self-center border-[#F1C21B] border-2 bg-transparent text-[#F1C21B]/90 font-semibold cursor-pointer hover:bg-black hover:text-[#F1C21B]/90 
                            min-w-[120px] px-3"
                                asChild
                            >
                                <SignInButton>{texts.layout.nav.signIn}</SignInButton>
                            </Button>
                        </SignedOut>
                    </div>
                    <div className="flex lg:hidden items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                                className="border-2 border-[#8800FF] bg-transparent/50 cursor-pointer p-1 rounded-full flex items-center justify-center w-10 h-10"
                            >
                                <Image
                                    src={`/languageImgs/${lang === 'vi' ? 'vietnam' : 'united-kingdom'}.png`}
                                    alt={lang === 'vi' ? 'Vietnam' : 'English'}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
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
                                    <div className=" pointer-events-none z-0">
                                        <div className="absolute w-full h-full">
                                            <div className="relative w-full h-full top-[30vh] right-[10vh]">
                                                <Image
                                                    src={`/exerciseimgs/alumni-form-bg-shape1.png`}
                                                    alt="123"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" pointer-events-none z-0">
                                        <div className="absolute w-full h-full">
                                            <div className="relative w-full h-full left-[10vh]">
                                                <Image
                                                    src={`/exerciseimgs/alumni-form-bg-shape2.png`}
                                                    alt="123"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <SheetHeader>
                                        <SheetTitle className="text-3xl">
                                            {texts.layout.nav.mobileNav.title}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {texts.layout.nav.mobileNav.Des}
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="grid flex-1 auto-rows-min border-t-2 border-[#A5C347] bg-white">
                                        <Button
                                            className="font-semibold justify-start text-lg text-[#A5C347] opacity-75 bg-white/90 rounded-none py-8 border-b-2 border-[#EC2265] hover:bg-white"
                                            asChild
                                        >
                                            <Link href="/">
                                                <HouseIcon /> {texts.layout.nav.home}
                                            </Link>
                                        </Button>
                                        <Button
                                            className="font-semibold justify-start text-lg text-[#EC2265] opacity-75 bg-white/90 rounded-none py-8 border-b-2 border-[#00D2DC] hover:bg-white"
                                            asChild
                                        >
                                            <Link href="/about">
                                                <FileTextIcon /> {texts.layout.nav.about}
                                            </Link>
                                        </Button>
                                        <Button
                                            className="font-semibold justify-start text-lg text-[#00D2DC] opacity-75 bg-white/90 rounded-none py-8 border-b-2 border-[#7B02E5] hover:bg-white"
                                            asChild
                                        >
                                            <Link href="/exercise">
                                                <BookIcon /> {texts.layout.nav.exercise}
                                            </Link>
                                        </Button>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button variant="outline">
                                                {texts.layout.nav.mobileNav.close}
                                            </Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                            <SignedOut>
                                <Button
                                    className="self-center text-xs border-[#F1C21B] border-2 bg-transparent text-[#F1C21B]/90 font-semibold cursor-pointer hover:bg-black hover:text-[#F1C21B]/90 
                                    min-w-[100px] px-1"
                                    asChild
                                >
                                    <SignInButton>{texts.layout.nav.signIn}</SignInButton>
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

// function Footer() {
//     return (
//         <footer className="relative bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 text-white pt-20 pb-4 text-center overflow-hidden">
//             {/* Sóng trên tĩnh */}
//             <div className="absolute top-0 left-0 w-full h-[120px] overflow-hidden">
//                 <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
//                     <path
//                         d="M0,60 C360,0 1080,120 1440,60 L1440,0 L0,0 Z"
//                         fill="#60a5fa"
//                         opacity="0.8"
//                     />
//                     <path
//                         d="M0,70 C360,10 1080,110 1440,50 L1440,0 L0,0 Z"
//                         fill="#2563eb"
//                         opacity="0.6"
//                     />
//                     <path
//                         d="M0,80 C360,20 1080,100 1440,40 L1440,0 L0,0 Z"
//                         fill="#1e40af"
//                         opacity="0.4"
//                     />
//                 </svg>
//             </div>

//             {/* Sóng animated (brush stroke nhỏ) */}
//             <div className="absolute top-0 left-0 w-full h-[120px]">
//                 <svg
//                     className="absolute w-full h-full scale-y-[-1]"
//                     viewBox="0 0 2 1"
//                     preserveAspectRatio="none"
//                 >
//                     <defs>
//                         <path
//                             id="w"
//                             d="
//                 m0 1v-.5
//                 q.5.5 1 0
//                 t1 0 1 0 1 0
//                 v.5z"
//                         />
//                     </defs>
//                     <g>
//                         <use
//                             href="#w"
//                             y=".0"
//                             fill="#60a5fa"
//                             style={{
//                                 animation: 'moveForever 18s linear infinite',
//                             }}
//                         />
//                         <use
//                             href="#w"
//                             y=".1"
//                             fill="#2563eb"
//                             style={{
//                                 animation: 'moveForever 16s linear infinite',
//                                 animationDelay: '-1.5s',
//                             }}
//                         />
//                         <use
//                             href="#w"
//                             y=".2"
//                             fill="#1e40af"
//                             style={{
//                                 animation: 'moveForever 10s linear infinite',
//                             }}
//                         />
//                     </g>
//                     <style>{`
//             @keyframes moveForever {
//               0% { transform: translate(-2px, 0); }
//               100% { transform: translate(0px, 0); }
//             }
//           `}</style>
//                 </svg>
//             </div>

//             {/* Nội dung footer */}
//             <div className="pt-8 relative z-10">
//                 <Link
//                     className="text-3xl flex items-center justify-center font-semibold text-white"
//                     href="/"
//                 >
//                     <SchoolIcon className="mr-2" />
//                     Logo
//                 </Link>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-12 gap-6 mt-4">
//                     {/* About Us */}
//                     <div>
//                         <Button
//                             className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
//                             asChild
//                         >
//                             <Link
//                                 className="text-xl flex items-center justify-center font-semibold text-blue-600"
//                                 href="/"
//                             >
//                                 About Us
//                             </Link>
//                         </Button>
//                         <p className="text-gray-100 max-w-xl mx-auto text-sm">
//                             Empowering learners with quality content and modern web solutions —
//                             built with passion and precision.
//                         </p>
//                     </div>

//                     {/* Keep Connected */}
//                     <div>
//                         <Button
//                             className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
//                             asChild
//                         >
//                             <Link
//                                 className="text-xl flex items-center justify-center font-semibold text-blue-600"
//                                 href="/"
//                             >
//                                 Keep Connected
//                             </Link>
//                         </Button>
//                         <div className="flex justify-center gap-4">
//                             {[
//                                 FacebookIcon,
//                                 MailIcon,
//                                 GithubIcon,
//                                 SendIcon,
//                                 TwitterIcon,
//                                 DribbbleIcon,
//                             ].map((Icon, idx) => (
//                                 <Button
//                                     key={idx}
//                                     className="w-10 h-10 flex items-center justify-center bg-white shadow-lg rounded-full hover:scale-105 hover:bg-gray-300 transition cursor-pointer"
//                                     asChild
//                                 >
//                                     <Link className="text-blue-600" href="/">
//                                         <Icon className="w-4 h-4 text-blue-600" />
//                                     </Link>
//                                 </Button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Contact */}
//                     <div>
//                         <Button
//                             className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
//                             asChild
//                         >
//                             <Link
//                                 className="text-xl flex items-center justify-center font-semibold text-blue-600"
//                                 href="/"
//                             >
//                                 Contact Us
//                             </Link>
//                         </Button>
//                         <div className="flex gap-4 mb-2">
//                             <HomeIcon />
//                             <span>Ha Noi, xxxx, xxxx</span>
//                         </div>
//                         <div className="flex gap-4 mb-2">
//                             <PhoneIcon />
//                             <span>123456789</span>
//                         </div>
//                         <div className="flex gap-4">
//                             <MailIcon />
//                             <span>huynguyen2004119007@gmail.com</span>
//                         </div>
//                     </div>
//                 </div>

//                 <p className="text-xs text-gray-200 mt-10">© 2025 All Rights Reserved</p>
//             </div>
//         </footer>
//     );
// }
