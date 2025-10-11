'use client';
import { useLanguage } from '@/context/LanguageContext';
import { animateChooseUs } from '@/lib/animations/animateChooseUs';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ChooseUs() {
    const { texts } = useLanguage();

    useEffect(() => {
        animateChooseUs();
    }, []);
    return (
        <div
            className="chooseus-container relative w-full h-full lg:h-[90vh] bg-[#625DF0] bg-cover bg-center bg-blend-overlay lg:flex items-center justify-center"
            style={{
                backgroundImage: "url('/chooseUsimgs/background.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-[#1F18EE]/60" />

            <div className="justify-items-center lg:justify-items-start relative z-10 grid grid-cols-1 h-full lg:grid-cols-2 gap-16 items-center max-w-6xl px-12 lg:px-0 ">
                <div className="space-y-6 lg:mt-0 mt-20">
                    <div className="space-y-8 chooseus-text">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white text-center lg:text-left">
                            {texts.home.chooseUs.title}
                        </h3>
                        <p className="text-white text-center lg:text-left min-h-[80] lg:min-h-0">
                            {texts.home.chooseUs.titleDes}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative lg:w-16 lg:h-16 w-12 h-12">
                                <Image
                                    src="/chooseUsimgs/icons8-brain-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">
                                {texts.home.chooseUs.card.card1title}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative lg:w-16 lg:h-16 w-12 h-12">
                                <Image
                                    src="/chooseUsimgs/icons8-museum-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">
                                {texts.home.chooseUs.card.card2title}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative lg:w-16 lg:h-16 w-12 h-12">
                                <Image
                                    src="/chooseUsimgs/icons8-search-book-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">
                                {texts.home.chooseUs.card.card3title}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative lg:mb-0 mb-20 lg:w-120 lg:h-120 w-92 h-92 lg:justify-self-end flex justify-center items-end overflow-visible">
                    <Image
                        src="/chooseUsimgs/classworks.webp"
                        alt="Background"
                        fill
                        className="object-cover lg:object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
