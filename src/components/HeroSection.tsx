'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { animateTypewriterLoop, animateTypewriterOnce } from '@/lib/animations/WordByWordAnimation';
import { useEffect } from 'react';

export default function HeroSection() {
    useEffect(() => {
        animateTypewriterOnce('.typewriter-once');
        animateTypewriterLoop('.typewriter-loop', ['The Magical Space', 'The Great Galaxy']);
    }, []);

    return (
        <section
            className="relative w-screen min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/herosectionimgs/background.png')" }}
        >
            {/* Nội dung chính */}
            <div className="pt-34 text-center z-10 relative flex items-center flex-col">
                <h1 className="typewriter-loop font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-center relative inline-block">
                    <span className="typewriter-once">Explore</span> <br />
                    <span className="relative inline-block overflow-visible">
                        <span className="typewriter-text bg-gradient-to-b from-[#8DA4EA] to-white bg-clip-text text-transparent"></span>
                    </span>
                    <span className="cursor">|</span>
                </h1>

                <p className="typewriter-once mt-6 text-base md:text-lg opacity-90">
                    Explore the secrets of space.
                    <br className="hidden md:block" />
                    NanoX helps you check space galactics.
                </p>

                <Button
                    className="animate-slide-up mt-10 flex w-fit items-center justify-center gap-3 px-12 py-6 border-2 border-[#8DA4EA] rounded-full hover:scale-105 transition-transform cursor-pointer"
                    variant={'ghost'}
                >
                    <span className="border-2 border-[#8DA4EA] rounded-full w-6 h-6 flex items-center justify-center">
                        <ArrowDownIcon />
                    </span>
                    Discover how it works
                </Button>
            </div>

            {/* Overlay hình ảnh */}
            <div className="relative w-full mt-auto flex justify-center z-0">
                {/* Earth */}
                <Image
                    src="/herosectionimgs/earth.png"
                    alt="Earth"
                    width={400}
                    height={400}
                    style={{ width: '40%', height: '40%' }}
                    className="relative z-1"
                />

                <div
                    className="absolute -top-[40%] left-[60%] w-full h-full bg-no-repeat bg-contain z-2"
                    style={{ backgroundImage: "url('/herosectionimgs/space-research.png')" }}
                />
            </div>

            {/* Globe Overlay */}
            <div
                className="absolute top-[60%] left-[10%] w-[15%] h-[15%] bg-no-repeat bg-contain"
                style={{ backgroundImage: "url('/herosectionimgs/globe.png')" }}
            />
        </section>
    );
}
