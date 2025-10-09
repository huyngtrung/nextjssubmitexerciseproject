'use client';

import { Button } from '@/components/ui/button';
import { UserButtonFlower } from '@/components/UserButtonFlower';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();
    const navLinks = [
        { href: '/', label: 'Home', color: '#A5C347' },
        { href: '/about', label: 'About', color: '#FF236C' },
        // { href: '/bookread', label: 'Library', color: '#00D2DC' },
        { href: '/exercise', label: 'Exercise', color: '#00D2DC' },
        // { href: '/exercise', label: 'Exercise', color: '#8800FF' },
    ];

    return (
        <header
            className={`flex z-20 py-8 fixed top-0 w-full transition-colors duration-300 bg-transparent`}
        >
            <nav className="flex gap-4 container mx-28 px-8 py-4 bg-white/5 backdrop-blur-xs rounded-full border-2 border-gray-300 shadow-lg shadow-white/20">
                <Link
                    className="animate-slide-up mr-auto text-lg flex items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                    href="/"
                >
                    Logo
                </Link>

                <Suspense fallback={null}>
                    <SignedIn>
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="font-semibold text-md animate-slide-up flex items-center px-2
                                            opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out
                                            hover:-translate-y-1 hover:scale-105 relative"
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
                            <UserButtonFlower />
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <Button className="self-center" asChild>
                            <SignInButton>Sign In</SignInButton>
                        </Button>
                    </SignedOut>
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
