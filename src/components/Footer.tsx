'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    SchoolIcon,
    FacebookIcon,
    MailIcon,
    GithubIcon,
    SendIcon,
    TwitterIcon,
    DribbbleIcon,
    HomeIcon,
    PhoneIcon,
} from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
    const [bubbles, setBubbles] = useState<
        { size: number; distance: number; position: number; time: number; delay: number }[]
    >([]);

    useEffect(() => {
        const generated = Array.from({ length: 128 }, () => ({
            size: 2 + Math.random() * 4,
            distance: 6 + Math.random() * 4,
            position: -5 + Math.random() * 110,
            time: 2 + Math.random() * 2,
            delay: -1 * (2 + Math.random() * 2),
        }));
        setBubbles(generated);
    }, []);

    return (
        <footer className="relative bg-gradient-to-b from-[#817BFF] via-[#6F66F0] to-[#5D58EF] text-white pt-20 pb-4 text-center">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/footer-pattern.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Hiệu ứng bong bóng động phía trên */}
            <div className="absolute top-0 left-0 w-full h-[200px] overflow-hidden z-0 bubbles">
                {bubbles.map((bubble, i) => (
                    <div
                        key={i}
                        className="bubble"
                        style={
                            {
                                '--size': `${bubble.size}rem`,
                                '--distance': `${bubble.distance}rem`,
                                '--position': `${bubble.position}%`,
                                '--time': `${bubble.time}s`,
                                '--delay': `${bubble.delay}s`,
                            } as React.CSSProperties
                        }
                    />
                ))}

                {/* SVG filter blob */}
                <svg style={{ position: 'fixed', top: '100vh' }}>
                    <defs>
                        <filter id="blob">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                                result="blob"
                            />
                        </filter>
                    </defs>
                </svg>

                <style>{`
          .bubbles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: transparent;
            filter: url("#blob");
            z-index: 0;
          }
          .bubble {
            position: absolute;
            top: -4rem;
            left: var(--position, 50%);
            background: #5D58EF;
            border-radius: 100%;
            animation: bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
                       bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s);
            transform: translateX(-50%);
          }
          @keyframes bubble-size {
            0%, 75% {
              width: var(--size, 4rem);
              height: var(--size, 4rem);
            }
            100% {
              width: 0rem;
              height: 0rem;
            }
          }
          @keyframes bubble-move {
            0% {
              top: -4rem;
            }
            100% {
              top: var(--distance, 10rem);
            }
          }
        `}</style>
            </div>

            {/* Nội dung footer */}
            <div className="pt-8 relative z-10">
                <Link
                    className="text-3xl flex items-center justify-center font-semibold text-white"
                    href="/"
                >
                    <SchoolIcon className="mr-2" />
                    Logo
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-12 gap-6 mt-4">
                    {/* About Us */}
                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                About Us
                            </Link>
                        </Button>
                        <p className="text-gray-100 max-w-xl mx-auto text-sm">
                            Empowering learners with quality content and modern web solutions —
                            built with passion and precision.
                        </p>
                    </div>

                    {/* Keep Connected */}
                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                Keep Connected
                            </Link>
                        </Button>
                        <div className="flex justify-center gap-4">
                            {[
                                FacebookIcon,
                                MailIcon,
                                GithubIcon,
                                SendIcon,
                                TwitterIcon,
                                DribbbleIcon,
                            ].map((Icon, idx) => (
                                <Link
                                    key={idx}
                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-lg rounded-full hover:scale-105 hover:bg-gray-300 transition cursor-pointer text-blue-600"
                                    href="/"
                                >
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                Contact Us
                            </Link>
                        </Button>
                        <div className="flex gap-4 mb-2">
                            <HomeIcon />
                            <span>Ha Noi, xxxx, xxxx</span>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <PhoneIcon />
                            <span>123456789</span>
                        </div>
                        <div className="flex gap-4">
                            <MailIcon />
                            <span>huynguyen2004119007@gmail.com</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-200 mt-10">© 2025 All Rights Reserved</p>
            </div>
        </footer>
    );
}
