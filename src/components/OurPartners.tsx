'use client';

import Image from 'next/image';

const SVG_FILES = ['client1-logo', 'client2-logo', 'client3-logo', 'client4-logo'];

type Lang = 'vi' | 'en';

type OurPartnersTexts = {
    home: {
        ourPartners: {
            title: string;
            titledes: string;
        };
    };
};

const texts: Record<Lang, OurPartnersTexts> = {
    vi: {
        home: {
            ourPartners: {
                title: 'Đối Tác Của Chúng Tôi',
                titledes:
                    'Hợp tác với các đối tác giáo dục đáng tin cậy để mang đến cơ hội học tập chất lượng và phát triển cho mọi học sinh.',
            },
        },
    },
    en: {
        home: {
            ourPartners: {
                title: 'Our Partners',
                titledes:
                    'We collaborate with trusted educational partners to provide quality learning, innovation, and growth opportunities for every student.',
            },
        },
    },
};

function getTextsForLang(lang: string): OurPartnersTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default function OurPartners({ lang }: { lang: 'vi' | 'en' }) {
    const textsForLang = getTextsForLang(lang);

    return (
        <div className="relative flex items-center flex-col px-12 md:px-20 md:pt-20 overflow-hidden bg-white min-h-[80vh]">
            <div className="relative z-10 text-center md:mb-0 mb-20">
                <div className="mb-16 flex flex-col items-center">
                    <h1 className="card-fade-seq text-4xl md:text-5xl font-bold mb-4 text-center">
                        {textsForLang.home.ourPartners.title}
                    </h1>

                    <div className="flex items-center justify-center card-fade-seq">
                        <div className="h-[2px] bg-[#9BBD33] w-20 md:w-20"></div>
                        <div className="h-[6px] bg-[#9BBD33] w-36 md:w-40 rounded"></div>
                        <div className="h-[2px] bg-[#9BBD33] w-20 md:w-20"></div>
                    </div>

                    <p className="text-gray-400 my-12 md:w-[100vh]">
                        {textsForLang.home.ourPartners.titledes}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 items-center justify-items-center">
                    {SVG_FILES.map((file) => (
                        <div key={file} className="w-[30vh] h-full cursor-pointer">
                            <Image
                                src={`/ourPartnersimgs/${file}.png`}
                                alt={file}
                                width={128}
                                height={128}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
