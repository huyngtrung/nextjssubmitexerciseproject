'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { animateTypewriterLoop, animateTypewriterOnce } from '@/lib/animations/WordByWordAnimation';
import { useEffect } from 'react';

type Lang = 'vi' | 'en';

type HomeHeaderTexts = {
    home: {
        header: {
            titleHeader: string;
            titleHeaderDes1: string;
            titleHeaderDes2: string;
            titleDes: string;
            actionContext: string;
        };
    };
};

const texts: Record<Lang, HomeHeaderTexts> = {
    vi: {
        home: {
            header: {
                titleHeader: 'Khám Phá',
                titleHeaderDes1: 'Thế Giới Học Tập',
                titleHeaderDes2: 'Tương Lai Sáng',
                titleDes:
                    'Khám phá niềm vui học tập. EduX giúp bạn mở rộng kiến thức và phát triển bản thân.',
                actionContext: 'Xem cách hoạt động',
            },
        },
    },
    en: {
        home: {
            header: {
                titleHeader: 'Discover',
                titleHeaderDes1: 'The Learning World',
                titleHeaderDes2: 'The Bright Future',
                titleDes:
                    'Discover the joy of learning. EduX helps you explore knowledge and growth.',
                actionContext: 'See how it works',
            },
        },
    },
};

function getTextsForLang(lang: string): HomeHeaderTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default function HeroSection({ params }: { params: { lang: string } }) {
    const lang = params.lang === 'vi' ? 'vi' : 'en';

    const textsForLang = getTextsForLang(lang);

    useEffect(() => {
        // Gán text mới cho tất cả .typewriter-once
        document.querySelectorAll<HTMLElement>('.typewriter-once').forEach((el) => {
            if (el.classList.contains('typewriter-once')) {
                if (el.tagName === 'P') {
                    el.dataset.text = textsForLang.home.header.titleDes;
                } else if (el.tagName === 'SPAN') {
                    el.dataset.text = textsForLang.home.header.titleHeader;
                }
            }
        });

        animateTypewriterOnce('.typewriter-once');

        const tl = animateTypewriterLoop('.typewriter-loop', [
            textsForLang.home.header.titleHeaderDes1,
            textsForLang.home.header.titleHeaderDes2,
        ]);

        return () => {
            tl?.kill();
        };
    }, [textsForLang]);

    return (
        <section
            className="relative w-full min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/herosectionimgs/background.png')" }}
        >
            {/* Header */}
            <div className="pt-34 text-center z-10 relative flex items-center flex-col px-8 md:px-0">
                <h1 className="typewriter-loop font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-center relative inline-block">
                    <span className="typewriter-once">{textsForLang.home.header.titleHeader}</span>{' '}
                    <br />
                    <span className="relative inline-block overflow-visible">
                        <span className="typewriter-text bg-gradient-to-b from-[#8DA4EA] to-white bg-clip-text text-transparent"></span>
                    </span>
                    <span className="cursor">|</span>
                </h1>

                <p className="typewriter-once mt-6 text-md md:text-lg opacity-90 break-words text-pretty leading-relaxed text-center md:text-center whitespace-pre-line sm:whitespace-normal">
                    {textsForLang.home.header.titleDes}
                    <br className="hidden md:block" />
                </p>

                <Button
                    className="animate-slide-up mt-10 flex w-fit items-center justify-center gap-3 px-12 py-6 border-2 border-[#8DA4EA] rounded-full hover:scale-105 transition-transform cursor-pointer"
                    variant={'ghost'}
                >
                    <span className="border-2 border-[#8DA4EA] rounded-full w-6 h-6 flex items-center justify-center">
                        <ArrowDownIcon />
                    </span>
                    <span className="min-w-[140px]">{textsForLang.home.header.actionContext}</span>
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
