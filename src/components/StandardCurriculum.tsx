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

export default function StandardCurriculum() {
    const [shapes, setShapes] = useState<JSX.Element[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerContainerRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newShapes: JSX.Element[] = [];

        SVG_FILES.forEach((file, index) => {
            const size = SHAPE_SIZES[Math.floor(Math.random() * SHAPE_SIZES.length)];
            const left = `${Math.random() * 90 + 5}%`;
            const top = `${Math.pow(Math.random(), 0.5) * 40 + 5}%`;
            const opacity = Math.random() * 0.3 + 0.3;

            newShapes.push(
                <div
                    key={`svg-min-${index}`}
                    className="bg-shape absolute"
                    style={{
                        width: size,
                        height: size,
                        left,
                        top,
                        opacity,
                    }}
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

        const remaining = 25 - SVG_FILES.length;
        for (let i = 0; i < remaining; i++) {
            const file = SVG_FILES[Math.floor(Math.random() * SVG_FILES.length)];
            const size = SHAPE_SIZES[Math.floor(Math.random() * SHAPE_SIZES.length)];
            const left = `${Math.random() * 90 + 5}%`;
            const top = `${Math.pow(Math.random(), 0.5) * 55 + 5}%`;
            const opacity = Math.random() * 0.3 + 0.1;

            newShapes.push(
                <div
                    key={`svg-rand-${i}`}
                    className="bg-shape absolute"
                    style={{
                        width: size,
                        height: size,
                        left,
                        top,
                        opacity,
                    }}
                >
                    <Image
                        src={`/standardCurriculumimgs/${file}.svg`}
                        alt={file as string}
                        width={size}
                        height={size}
                        draggable={false}
                    />
                </div>,
            );
        }

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
            className="relative flex items-center flex-col px-20 pt-20 overflow-hidden bg-white min-h-screen"
        >
            {shapes}
            <div className="relative z-10 text-center text-gray-800">
                <div className="mb-16" ref={headerContainerRef}>
                    <h1 className="card-fade-seq text-5xl font-bold mb-4 text-center">
                        Standard Curriculum
                    </h1>

                    {/* Đường kẻ ngang */}
                    <div className="flex items-center justify-center card-fade-seq">
                        <div className="h-[2px] bg-[#ff6d9d] w-10 md:w-20"></div>
                        <div className="h-[6px] bg-[#ff6d9d] w-20 md:w-40 rounded"></div>
                        <div className="h-[2px] bg-[#ff6d9d] w-10 md:w-20"></div>
                    </div>
                </div>

                <div className="relative z-10 text-center text-gray-800">
                    <div className="relative">
                        <Carousel
                            opts={{
                                align: 'start',
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="flex gap-4 px-4" ref={cardsContainerRef}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="flex-shrink-0 w-[220px] md:w-[260px] lg:w-[200px] md:basis-1/2 lg:basis-1/3"
                                    >
                                        <div className="mt-12 card-blur-in">
                                            <Card
                                                className="relative overflow-hidden flex items-center border-2 border-yellow-400 rounded-xl p-4
                                                transition-transform duration-300 ease-in-out
                                                hover:-translate-y-3 hover:border-yellow-300
                                                hover:shadow-[0_10px_20px_rgba(250,204,21,0.4)]
                                                cursor-pointer "
                                            >
                                                {/* Gradient vàng vòng quanh ảnh */}
                                                <div className="absolute inset-0 z-0 pointer-events-none">
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-1/3 blur-3xl"
                                                        style={{
                                                            background:
                                                                'linear-gradient(to bottom, rgba(250,204,21,0.5), rgba(250,204,21,0.2), transparent)',
                                                        }}
                                                    />
                                                </div>

                                                <div className="relative w-32 h-32 md:w-40 md:h-40 z-10">
                                                    {/* Ảnh nền */}
                                                    <div className="absolute -inset-4 md:-inset-6 z-0">
                                                        <Image
                                                            src="/blob.svg"
                                                            alt="Background"
                                                            fill
                                                            className="object-cover rounded-lg rotate-90"
                                                        />
                                                    </div>

                                                    {/* Ảnh chính */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-32 h-32 md:w-40 md:h-40 relative">
                                                            <Image
                                                                src="/science-1-42.svg"
                                                                alt="Main"
                                                                fill
                                                                className="object-cover rounded-lg z-10"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <CardHeader className="flex justify-center z-10">
                                                    <CardTitle className="whitespace-nowrap text-center">
                                                        Your Title
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="flex items-center justify-center p-6 flex-col gap-6 z-10">
                                                    <div>Your Description</div>
                                                    <Button
                                                        asChild
                                                        className="border-0 bg-transparent hover:bg-transparent focus:bg-transparent shadow-none cursor-pointer"
                                                        size="sm"
                                                    >
                                                        <Link href="/" className="text-yellow-400">
                                                            Read More
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Navigation buttons ở giữa dưới */}
                            <div className="flex justify-center gap-4 mt-4">
                                <CarouselPrevious className="text-white bg-yellow-400 border-gray-100 border-2 rounded-full p-8 hover:bg-[#ff6d9d] cursor-pointer" />
                                <CarouselNext className="text-white bg-yellow-400 border-gray-100 border-2 rounded-full p-8 hover:bg-[#ff6d9d] cursor-pointer" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}
