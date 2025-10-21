'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from './ui/card';
import { useEffect } from 'react';
import { animateHomeNew } from '@/lib/animations/animateHomeNew';

type Lang = 'vi' | 'en';

type HomeNew = {
    home: {
        homeNew: {
            NewMain: {
                title: string;
                titledes: string;
                time: string;
            };
            NewSub: {
                title1: string;
                time1: string;
                title2: string;
                time2: string;
                title3: string;
                time3: string;
                title4: string;
                time4: string;
            };
        };
    };
};

const texts: Record<Lang, HomeNew> = {
    vi: {
        home: {
            homeNew: {
                NewMain: {
                    title: 'Cùng Bé Tô Màu Cùng những cơ sở vật chất tốt',
                    titledes:
                        'Thương hiệu đẹp cho các thay đổi bởi Never Now ở Úc. Đây là nền tảng thảo luận mở, hợp tác và toàn diện.',
                    time: '19 Tháng 11, 2025',
                },
                NewSub: {
                    title1: 'Lớp học trải nghiệm sáng tạo',
                    time1: '19 Tháng 11, 2025',
                    title2: 'Tô màu nhóm vui nhộn cho trẻ',
                    time2: '19 Tháng 11, 2025',
                    title3: 'Ngày âm nhạc và vận động ở mẫu giáo',
                    time3: '19 Tháng 11, 2025',
                    title4: 'Khám phá ngoài trời cho trẻ',
                    time4: '19 Tháng 11, 2025',
                },
            },
        },
    },
    en: {
        home: {
            homeNew: {
                NewMain: {
                    title: 'Cùng Bé Tô Màu Cùng những cơ sở vật chất tốt',
                    titledes:
                        'Thương hiệu đẹp cho các thay đổi bởi Never Now ở Úc. Đây là nền tảng thảo luận mở, hợp tác và toàn diện.',
                    time: '19 Tháng 11, 2025',
                },
                NewSub: {
                    title1: 'Lớp học trải nghiệm sáng tạo',
                    time1: '19 Tháng 11, 2025',
                    title2: 'Tô màu nhóm vui nhộn cho trẻ',
                    time2: '19 Tháng 11, 2025',
                    title3: 'Ngày âm nhạc và vận động ở mẫu giáo',
                    time3: '19 Tháng 11, 2025',
                    title4: 'Khám phá ngoài trời cho trẻ',
                    time4: '19 Tháng 11, 2025',
                },
            },
        },
    },
};

function getTextsForLang(lang: string): HomeNew {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default function HomeNew({ lang }: { lang: 'vi' | 'en' }) {
    const textsForLang = getTextsForLang(lang);

    const posts = [
        {
            id: 1,
            date: textsForLang.home.homeNew.NewSub.time1,
            title: textsForLang.home.homeNew.NewSub.title1,
            color: '#65C8FF',
            imgUrl: 'blog-22-1000x625.jpg',
        },
        {
            id: 2,
            date: textsForLang.home.homeNew.NewSub.time2,
            title: textsForLang.home.homeNew.NewSub.title2,
            color: '#95B226',
            imgUrl: 'blog-1-1000x625.jpg',
        },
        {
            id: 3,
            date: textsForLang.home.homeNew.NewSub.time3,
            title: textsForLang.home.homeNew.NewSub.title3,
            color: '#5D58F0',
            imgUrl: 'blog-11-1000x625.jpg',
        },
        {
            id: 4,
            date: textsForLang.home.homeNew.NewSub.time4,
            title: textsForLang.home.homeNew.NewSub.title4,
            color: '#799F05',
            imgUrl: 'blog-15-1000x625.jpg',
        },
    ];

    useEffect(() => {
        animateHomeNew();
    }, []);

    return (
        <div className="relative w-full">
            <div className="relative w-full h-[200px] z-0">
                <img
                    src="/homeNewWaveTop.svg"
                    alt="Wave Top"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative w-full min-h-[85vh] bg-[#BDE8FF] flex justify-center items-center pt-8 pb-16 md:pb-0 md:pt-20 home-new-container">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full px-8">
                    {/* Cột bên trái: bài nổi bật */}
                    <div>
                        <Card className="room-main p-0 h-full rounded-2xl border-0 cursor-pointer">
                            <CardHeader className="p-0 m-0">
                                <div className="relative w-full h-[40vh]">
                                    <Image
                                        src="/homeNewimgs/blog-3-750x469.jpg"
                                        alt="Main Post"
                                        fill
                                        className="object-cover rounded-t-2xl"
                                    />
                                    <span className="absolute bottom-0 left-4 translate-y-1/2 bg-[#65C8FF] text-white text-md font-semibold px-6 py-2 rounded-full shadow-md">
                                        {textsForLang.home.homeNew.NewMain.time}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-col justify-center h-full gap-8 mb-4 mx-4 ">
                                <h1 className="text-2xl font-semibold -mb-2 min-h-[60] md:min-h-0">
                                    {textsForLang.home.homeNew.NewMain.title}
                                </h1>
                                <p className="text-md text-gray-600 leading-relaxed min-h-[80] md:min-h-0 ">
                                    {textsForLang.home.homeNew.NewMain.titledes}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ✅ Cột bên phải: hiển thị danh sách dạng grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                className="room-item overflow-hidden p-0 h-full rounded-2xl border-0 cursor-pointer"
                            >
                                <div className="relative w-full h-[20vh]">
                                    <Image
                                        src={`/homeNewimgs/${post.imgUrl}`}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded-t-2xl"
                                    />
                                    <span
                                        className="absolute bottom-0 left-4 translate-y-1/2 text-white text-xs font-medium px-6 py-2 rounded-full shadow-md"
                                        style={{ backgroundColor: post.color }}
                                    >
                                        {post.date}
                                    </span>
                                </div>

                                <CardContent className="flex flex-col justify-center gap-8 mb-8 mx-2 ">
                                    <h2 className="text-lg font-semibold -mb-2">{post.title}</h2>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[240px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 260">
                    <path
                        fill="#bde8ff"
                        fillOpacity="1"
                        d="M0,96L48,90.7C96,85,192,75,288,106.7C384,139,480,213,576,213.3C672,213,768,139,864,122.7C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}
