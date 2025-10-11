'use client';

import { JSX, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { animateBackgroundShapes } from '@/lib/animations/animateBackgroundShapes';
import { Button } from './ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from './ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { animateCards } from '@/lib/animations/animateCards';
import { animateBlurIn } from '@/lib/animations/animateblurin';
import { useLanguage } from '@/context/LanguageContext';

const SHAPE_SIZES = [40, 60, 80, 100, 120];
const SVG_FILES = [
    'accelerate-svgrepo-com',
    'cell-phone-svgrepo-com',
    'computer-svgrepo-com',
    'creativity-svgrepo-com',
    'document-svgrepo-com',
    'network-svgrepo-com',
    'thumbs-up-svgrepo-com',
    'trophy-svgrepo-com',
];
const CARD_COLORS = ['#F0AA00', '#31D9E3', '#FF236C', '#A5C36A', '#5D58EF'];
const CARD_IMAGES = [
    '/science-1-42.svg',
    '/science-1-42.svg',
    '/science-1-42.svg',
    '/science-1-42.svg',
    '/science-1-42.svg',
];

export default function StandardCurriculum() {
    const { texts } = useLanguage();
    const [shapes, setShapes] = useState<JSX.Element[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerContainerRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);

    const cards = [
        {
            title: texts.home.StandardCurriculumn.card?.card1title ?? '',
            des: texts.home.StandardCurriculumn.card?.card1des ?? '',
            color: CARD_COLORS[0],
            img: CARD_IMAGES[0],
        },
        {
            title: texts.home.StandardCurriculumn.card?.card2title ?? '',
            des: texts.home.StandardCurriculumn.card?.card2des ?? '',
            color: CARD_COLORS[1],
            img: CARD_IMAGES[1],
        },
        {
            title: texts.home.StandardCurriculumn.card?.card3title ?? '',
            des: texts.home.StandardCurriculumn.card?.card3des ?? '',
            color: CARD_COLORS[2],
            img: CARD_IMAGES[2],
        },
        {
            title: texts.home.StandardCurriculumn.card?.card4title ?? '',
            des: texts.home.StandardCurriculumn.card?.card4des ?? '',
            color: CARD_COLORS[3],
            img: CARD_IMAGES[3],
        },
        {
            title: texts.home.StandardCurriculumn.card?.card5title ?? '',
            des: texts.home.StandardCurriculumn.card?.card5des ?? '',
            color: CARD_COLORS[4],
            img: CARD_IMAGES[4],
        },
    ];

    useEffect(() => {
        const newShapes: JSX.Element[] = [];
        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.offsetWidth;

        SVG_FILES.forEach((file, index) => {
            const size = SHAPE_SIZES[Math.floor(Math.random() * SHAPE_SIZES.length)];
            const paddingPercent = window.innerWidth < 768 ? 12 : 20; // tương ứng px-12 / px-20
            const left = `${Math.random() * (100 - paddingPercent * 2) + paddingPercent}%`;
            const top = `${Math.pow(Math.random(), 0.5) * 40 + 5}%`;
            const opacity = Math.random() * 0.3 + 0.3;

            newShapes.push(
                <div
                    key={`svg-min-${index}`}
                    className="bg-shape absolute"
                    style={{ width: size, height: size, left, top, opacity }}
                >
                    <Image
                        src={`/standardCurriculumimgs/${file}.svg`}
                        alt={file}
                        width={size}
                        height={size}
                        draggable={false}
                    />
                </div>,
            );
        });

        // Phần random shapes còn lại cũng tương tự...
        setShapes(newShapes);
    }, []);

    useEffect(() => {
        animateBackgroundShapes(containerRef.current);
    }, [shapes]);

    useEffect(() => {
        animateCards(headerContainerRef);
        animateBlurIn(cardsContainerRef);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center flex-col px-0 md:px-20 overflow-hidden bg-white min-h-[90vh] md:min-h-[110vh]"
        >
            {shapes}
            <div className="relative z-10 text-center text-gray-800">
                <div className="md-12 md:mb-16" ref={headerContainerRef}>
                    <h1 className="card-fade-seq text-4xl md:text-5xl font-bold mb-4 text-center">
                        {texts.home.StandardCurriculumn.title}
                    </h1>
                    <div className="flex items-center justify-center card-fade-seq">
                        <div className="h-[2px] bg-[#ff6d9d] w-20 md:w-20"></div>
                        <div className="h-[6px] bg-[#ff6d9d] w-30 md:w-40 rounded"></div>
                        <div className="h-[2px] bg-[#ff6d9d] w-20 md:w-20"></div>
                    </div>
                </div>

                <div className="relative z-10 text-center text-gray-800">
                    <Carousel opts={{ align: 'start' }} className="w-full">
                        <CarouselContent className="flex gap-4 px-4" ref={cardsContainerRef}>
                            {cards.map((card, index) => (
                                <CarouselItem
                                    key={index}
                                    className="flex-shrink-0 w-[60] md:w-[140] lg:w-[240] md:basis-1/2 lg:basis-1/3 "
                                >
                                    <div className="mt-12 card-blur-in">
                                        <Card
                                            className={`relative overflow-hidden flex items-center border-2 rounded-xl p-4
                                            transition-transform duration-300 ease-in-out hover:-translate-y-3  hover:shadow-[0_10px_25px_${card.color}40,0_20px_50px_${card.color}20] cursor-pointer`}
                                            style={{
                                                borderColor: card.color,
                                                boxShadow: `0 10px 20px ${card.color}33`, // shadow mặc định 20% opacity
                                            }}
                                        >
                                            <div className="absolute inset-0 z-0 pointer-events-none">
                                                <div
                                                    className="absolute top-0 left-0 w-full h-1/3 blur-3xl"
                                                    style={{
                                                        background: `linear-gradient(to bottom, ${card.color}50, ${card.color}20, transparent)`,
                                                    }}
                                                />
                                            </div>

                                            <div className="relative w-32 h-32 md:w-40 md:h-40 z-10">
                                                <div className="absolute -inset-4 md:-inset-6 z-0">
                                                    <Image
                                                        src="/blob.svg"
                                                        alt="Background"
                                                        fill
                                                        className="object-cover rounded-lg rotate-90"
                                                    />
                                                </div>

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-32 h-32 md:w-40 md:h-40 relative">
                                                        <Image
                                                            src={card.img!}
                                                            alt="Main"
                                                            fill
                                                            className="object-cover rounded-lg z-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <CardHeader className="flex justify-center z-10">
                                                <CardTitle
                                                    className="whitespace-nowrap text-center"
                                                    style={{ color: card.color }}
                                                >
                                                    {card.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="flex items-center justify-center p-6 flex-col gap-6 z-10">
                                                <div style={{ color: card.color }}>{card.des}</div>
                                                <Button
                                                    asChild
                                                    className="border-0 bg-transparent hover:bg-transparent focus:bg-transparent shadow-none cursor-pointer"
                                                    size="sm"
                                                >
                                                    <Link href="/" style={{ color: card.color }}>
                                                        Read More
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex justify-center gap-4 mt-4">
                            <CarouselPrevious className="text-white bg-yellow-400 border-gray-100 border-2 rounded-full p-8 hover:bg-[#ff6d9d] cursor-pointer" />
                            <CarouselNext className="text-white bg-yellow-400 border-gray-100 border-2 rounded-full p-8 hover:bg-[#ff6d9d] cursor-pointer" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
