'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { animateTypewriterLoop, animateTypewriterOnce } from '@/lib/animations/WordByWordAnimation';
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
    const { texts } = useLanguage();

    useEffect(() => {
        // Gán text mới cho tất cả .typewriter-once
        document.querySelectorAll<HTMLElement>('.typewriter-once').forEach((el) => {
            if (el.classList.contains('typewriter-once')) {
                if (el.tagName === 'P') {
                    el.dataset.text = texts.home.header.titleDes;
                } else if (el.tagName === 'SPAN') {
                    el.dataset.text = texts.home.header.titleHeader;
                }
            }
        });

        animateTypewriterOnce('.typewriter-once');

        const tl = animateTypewriterLoop('.typewriter-loop', [
            texts.home.header.titleHeaderDes1,
            texts.home.header.titleHeaderDes2,
        ]);

        return () => {
            tl?.kill();
        };
    }, [texts]);

    return (
        <section
            className="relative w-full min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/herosectionimgs/background.png')" }}
        >
            {/* Header */}
            <div className="pt-34 text-center z-10 relative flex items-center flex-col px-8 md:px-0">
                <h1 className="typewriter-loop font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-center relative inline-block">
                    <span className="typewriter-once">{texts.home.header.titleHeader}</span> <br />
                    <span className="relative inline-block overflow-visible">
                        <span className="typewriter-text bg-gradient-to-b from-[#8DA4EA] to-white bg-clip-text text-transparent"></span>
                    </span>
                    <span className="cursor">|</span>
                </h1>

                <p className="typewriter-once mt-6 text-md md:text-lg opacity-90 break-words text-pretty leading-relaxed text-center md:text-center whitespace-pre-line sm:whitespace-normal">
                    {texts.home.header.titleDes}
                    <br className="hidden md:block" />
                </p>

                <Button
                    className="animate-slide-up mt-10 flex w-fit items-center justify-center gap-3 px-12 py-6 border-2 border-[#8DA4EA] rounded-full hover:scale-105 transition-transform cursor-pointer"
                    variant={'ghost'}
                >
                    <span className="border-2 border-[#8DA4EA] rounded-full w-6 h-6 flex items-center justify-center">
                        <ArrowDownIcon />
                    </span>
                    <span className="min-w-[140px]">{texts.home.header.actionContext}</span>
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
                    className="relative z-1 w-full h-[35vh] md:w-[40%] md:h-[40%] object-cover"
                />

                {/* Space overlay */}
                <div
                    className="absolute -top-[60%]  md:-top-[50%] left-[60%] w-full h-full bg-no-repeat bg-contain z-2"
                    style={{ backgroundImage: "url('/herosectionimgs/space-research.png')" }}
                />
            </div>

            {/* Globe Overlay */}
            <div
                className="absolute top-[50%] left-[5%] w-[25%] h-[25%] sm:top-[60%] sm:left-[10%] sm:w-[15%] sm:h-[15%] bg-no-repeat bg-contain"
                style={{ backgroundImage: "url('/herosectionimgs/globe.png')" }}
            />
        </section>
    );
}
