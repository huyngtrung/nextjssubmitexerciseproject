'use client';
import { animateChooseUs } from '@/lib/animations/animateChooseUs';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ChooseUs() {
    useEffect(() => {
        animateChooseUs();
    }, []);
    return (
        <div
            className="chooseus-container relative w-full h-[90vh] bg-[#625DF0] bg-cover bg-center bg-blend-overlay flex items-center justify-center"
            style={{
                backgroundImage: "url('/chooseUsimgs/background.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-[#1F18EE]/60" />

            <div className="relative z-10 grid grid-cols-2 gap-16 items-center h-full max-w-6xl ">
                <div className="space-y-6">
                    <div className="space-y-8 chooseus-text">
                        <h3 className="text-4xl font-bold text-white">
                            Why Our Schools are the Right Fit for Your Child?
                        </h3>
                        <p className="text-white">
                            Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
                            Phasellus viverra nulla ut metus varius laoreet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/chooseUsimgs/icons8-brain-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">
                                Well Trained Professionals
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/chooseUsimgs/icons8-museum-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">Awesome Infra-Structure</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-2 chooseus-icon">
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/chooseUsimgs/icons8-search-book-96.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-semibold text-lg">
                                International Lesson Patterns
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative w-120 h-120 justify-self-end chooseus-image">
                    <Image
                        src="/chooseUsimgs/classworks.webp"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
