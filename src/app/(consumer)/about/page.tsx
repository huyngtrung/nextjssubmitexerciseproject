'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { CircleArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    initAboutPageAnimations,
    SectionAboutPageAnimations,
} from '@/lib/animations/initAboutPageAnimations';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useLanguage } from '@/context/LanguageContext';

type IconData = { name: string; top: number; left: number };

const iconsList = [
    'books-svgrepo-com',
    'briefcase-svgrepo-com',
    'earth-globe-svgrepo-com',
    'paint-palette-svgrepo-com',
    'pen-svgrepo-com',
    'pencil-svgrepo-com',
    'school-supplies-svgrepo-com',
    'stapler-svgrepo-com',
    'trophy-svgrepo-com',
    'calculator-svgrepo-com',
    'calendar-svgrepo-com',
    'ruler-svgrepo-com',
    'notebook-svgrepo-com',
];

export default function AboutPage() {
    const { texts } = useLanguage();
    const [icons, setIcons] = useState<IconData[]>([]);

    useEffect(() => {
        const rows = 5; // số hàng
        const cols = 5; // số cột
        const cellWidth = 100 / cols;
        const cellHeight = 80 / rows; // giới hạn top 0-80% như bạn trước đó

        const newIcons: IconData[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const top = row * cellHeight + Math.random() * (cellHeight - 10); // tránh quá sát viền
                const left = col * cellWidth + Math.random() * (cellWidth - 10);
                newIcons.push({
                    name: iconsList[Math.floor(Math.random() * iconsList.length)]!,
                    top,
                    left,
                });
            }
        }

        setIcons(newIcons);
    }, []);

    useEffect(() => {
        if (icons.length === 0) return;
        initAboutPageAnimations();
    }, [icons]);

    useEffect(() => {
        SectionAboutPageAnimations();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-[200vh] scroll-container relative">
            {/* Icon nền */}
            <div className="icons-container fixed inset-0 pointer-events-none z-0">
                {icons.map((icon, idx) => (
                    <div
                        key={idx}
                        className="about-bg-icon absolute w-16 h-16 md:w-24 md:h-24 opacity-50"
                        style={{
                            top: `${icon.top}%`,
                            left: `${icon.left}%`,
                        }}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={`/backgroundimgs/${icon.name}.svg`}
                                alt={icon.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                    src="/aboutimgs/scale-bg.jpg"
                    alt="About Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <nav className="mb-2 text-sm text-white/80">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            {texts.about.header.title}
                        </h1>
                        <div className="flex gap-3 text-lg justify-center items-center">
                            <Link href="/" className="hover:text-[#F0AA00] text-[#CBECE5]">
                                {texts.layout.nav.home}
                            </Link>
                            <CircleArrowRightIcon /> {texts.layout.nav.about}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Cards */}
            <div className="about-card my-16 max-w-6xl px-8 md:px-0 flex flex-col justify-center w-full">
                {/* Vision & Mission */}
                <div className="pt-12 py-0 md:py-12 text-center mb-4 md:mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        {texts.about.visionMission.title}
                    </h1>
                    <div className="flex items-center justify-center">
                        <div className="h-[2px] bg-[#ff6d9d] w-20 md:w-20"></div>
                        <div className="h-[6px] bg-[#ff6d9d] w-32 md:w-40 rounded"></div>
                        <div className="h-[2px] bg-[#ff6d9d] w-20 md:w-20"></div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-16 md:flex md:flex-row w-full items-end justify-center px-8 md:gap-6 mt-16">
                    {['Left', 'Middle', 'Right'].map((label, idx) => (
                        <Card
                            key={idx}
                            className={`flex-1 relative overflow-hidden flex flex-col items-center border-2 border-opacity-20 rounded-xl md:p-4 pb-12
                                transition-transform duration-300 ease-in-out
                                hover:-translate-y-3  justify-center md:justify-start 
                                cursor-pointer min-h-[480] md:min-h-[440]
                                ${label === 'Left' ? 'border-[#5D58F0]/20 hover:border-[#817DFF]' : ''}
                                ${label === 'Middle' ? 'border-[#FF236C]/20 hover:border-[#FF5492] md:-mt-8  md:mb-16' : ''}
                                ${label === 'Right' ? 'border-[#A8C347]/20 hover:border-[#C3E166]' : ''}`}
                        >
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <div
                                    className="absolute top-0 left-0 w-full h-1/2 blur-4xl"
                                    style={{
                                        background:
                                            label === 'Left'
                                                ? 'linear-gradient(to bottom, rgba(93,88,240,0.5), rgba(93,88,240,0.2), transparent)'
                                                : label === 'Middle'
                                                  ? 'linear-gradient(to bottom, rgba(255,35,108,0.5), rgba(255,35,108,0.2), transparent)'
                                                  : 'linear-gradient(to bottom, rgba(168,195,71,0.5), rgba(168,195,71,0.2), transparent)',
                                    }}
                                />
                            </div>

                            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                                <Image
                                    src="/blob.svg"
                                    alt="Background"
                                    fill
                                    className="object-cover rounded-lg rotate-90"
                                />
                                <Image
                                    src="/science-1-42.svg"
                                    alt="Main"
                                    fill
                                    className="object-cover rounded-lg absolute inset-0"
                                />
                            </div>

                            <CardHeader className="flex justify-center">
                                <CardTitle className="whitespace-nowrap text-center">
                                    {(() => {
                                        const key =
                                            `card${idx + 1}title` as keyof typeof texts.about.visionMission.card;
                                        return texts.about.visionMission.card[key] ?? '';
                                    })()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4 p-4">
                                <div>
                                    {(() => {
                                        const key =
                                            `card${idx + 1}des` as keyof typeof texts.about.visionMission.card;
                                        return texts.about.visionMission.card[key] ?? '';
                                    })()}
                                </div>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-transparent border-0 shadow-none"
                                ></Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* About Us Section */}
            <div className="about-section relative w-full ">
                <div className="relative w-full h-[200px] z-0">
                    <Image src="/waveTop.svg" alt="Wave Top" fill className="object-cover" />
                </div>
                <div className="px-8 relative w-full h-[80vh] bg-[#F6F6F6] flex flex-col items-center text-center md:px-4">
                    <h1 className=" text-4xl md:text-5xl font-bold mb-8 mt-16">
                        {texts.about.aboutUs.title}
                    </h1>
                    <p className="max-w-xl text-gray-400 md:mb-6 md:min-h-0 min-h-[80]">
                        {texts.about.aboutUs.titledes}
                    </p>
                    <div className="relative w-[80vh] h-[40vh] mt-8">
                        <Image
                            src="https://picsum.photos/seed/1/800/600"
                            alt="aboutpic"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                </div>
                <div className="relative w-full h-[220px]">
                    <Image src="/waveBottom.svg" alt="Wave Bottom" fill className="object-cover" />
                </div>
            </div>

            {/* Other */}
            <div className="px-12 lg:px-0 about-other relative z-10 h-[100vh] mb-24 md:mb-0 md:h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-w-6xl w-full py-20">
                <div className="space-y-12">
                    <div className="space-y-6 scroll-animate">
                        <h3 className=" text-2xl md:text-4xl font-semibold min-h-[112] md:min-h-[120]">
                            {texts.about.other.title}
                        </h3>
                        <p className="text-justify text-gray-500 text-lg min-h-[112] md:min-h-[100]">
                            {texts.about.other.des}
                        </p>
                    </div>

                    <div className="flex items-center min-h-[20]">
                        <Button
                            className="bg-[#5D58EF] py-6 px-14 text-lg rounded-full hover:bg-[#FF236C]"
                            asChild
                        >
                            <Link href="/about" className="font-semibold">
                                {texts.about.other.link}
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="relative w-full h-80 md:h-full overflow-hidden rounded-b-[50%]">
                    <Image
                        src="/aboutimgs/half-img.jpg"
                        alt="halfimg"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Members */}
            <div className="relative w-full about-members">
                <div className="relative w-full min-h-[80px]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 288">
                        <path
                            fill="#F1C21B"
                            fillOpacity="1"
                            d="M0,96L48,128C96,160,192,224,288,208C384,192,480,96,576,85.3C672,75,768,149,864,165.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
                <div className="relative w-full min-h-[100vh] bg-[#F1C21B] flex justify-center pt-12 lg:px-0 px-12">
                    <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 items-start md:mb-12 mb-20">
                        <div className="w-full lg:w-1/3 flex items-center text-justify">
                            <p>
                                <span className="font-bold text-2xl md:text-3xl">
                                    {texts.about.members.title}
                                </span>
                                <br />
                                <br />

                                {/* des1 */}
                                <span>
                                    <strong>
                                        {texts.about.members.des1.split(' ').slice(0, 2).join(' ')}
                                        ,{' '}
                                    </strong>
                                    {texts.about.members.des1.split(' ').slice(2).join(' ')}
                                </span>
                                <br />
                                <br />

                                {/* des2 */}
                                <span>
                                    <strong>
                                        {texts.about.members.des2.split(' ').slice(0, 2).join(' ')}
                                        ,{' '}
                                    </strong>
                                    {texts.about.members.des2.split(' ').slice(2).join(' ')}
                                </span>
                                <br />
                                <br />

                                {/* des3 */}
                                <span>
                                    <strong>
                                        {texts.about.members.des3.split(' ').slice(0, 2).join(' ')}
                                        ,{' '}
                                    </strong>
                                    {texts.about.members.des3.split(' ').slice(2).join(' ')}
                                </span>
                            </p>
                        </div>
                        <div className="w-full lg:w-2/3 relative">
                            <div className="sticky top-16">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                                    {[...Array(7)].map((_, idx) => (
                                        <div key={idx} className="mx-auto lg:mx-0">
                                            <Image
                                                src={`https://picsum.photos/seed/${idx + 1}/200/300`}
                                                alt={`member-${idx + 1}`}
                                                className="w-[30vh] h-[20vh] object-cover rounded-lg"
                                                width={400}
                                                height={240}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* quote */}
            <div className="h-[90vh] w-full flex justify-center items-center my-12 about-quote">
                <Carousel opts={{ align: 'start' }} className="w-[80vw] h-[70vh] relative">
                    <CarouselContent className="flex gap-0 px-0 w-[80vw] h-[70vh]">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="flex-shrink-0 w-full h-full relative"
                            >
                                {/* Nội dung overlay */}
                                <div className="relative z-10 w-full h-full flex items-center justify-center ">
                                    <Card className="overflow-hidden h-full w-full flex items-center justify-center rounded-xl p-4 cursor-pointer bg-[#ff0f5b]/80 border-0 shadow-none">
                                        {/* Nền ảnh và màu */}
                                        <div
                                            className="absolute inset-0 "
                                            style={{
                                                backgroundImage: 'url(/aboutimgs/9161244.png)',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-white/20" />
                                        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center bg-[#ff0f5b]/80">
                                            <svg
                                                className="w-9 h-9 transition-colors duration-500 rotate-180"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M7.17 6.17C6.06 7.28 5.5 8.77 5.5 10.5c0 1.72 0.56 3.22 1.67 4.33 1.11 1.11 2.61 1.67 4.33 1.67v-2c-1.01 0-1.98-0.39-2.71-1.12-0.73-0.73-1.12-1.7-1.12-2.71s0.39-1.98 1.12-2.71l-2-2zm8 0C14.06 7.28 13.5 8.77 13.5 10.5c0 1.72 0.56 3.22 1.67 4.33 1.11 1.11 2.61 1.67 4.33 1.67v-2c-1.01 0-1.98-0.39-2.71-1.12-0.73-0.73-1.12-1.7-1.12-2.71s0.39-1.98 1.12-2.71l-2-2z" />
                                            </svg>
                                        </div>

                                        <CardHeader className="flex justify-center z-10">
                                            <CardTitle className="whitespace-nowrap text-center">
                                                {(() => {
                                                    const key =
                                                        `card${index + 1}title` as keyof typeof texts.about.quotes;
                                                    return texts.about.quotes[key] ?? '';
                                                })()}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex items-center justify-center p-6 flex-col gap-6 z-10">
                                            {(() => {
                                                const key =
                                                    `card${index + 1}des` as keyof typeof texts.about.quotes;
                                                return texts.about.quotes[key] ?? '';
                                            })()}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}
