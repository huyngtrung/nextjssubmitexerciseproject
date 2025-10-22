'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { animateClients, initScrollAnimations } from '@/lib/animations/animateClientsTestimonials';

interface Client {
    id: number;
    name: string;
    text: string;
    imgUrl: string;
    borderColor: string;
}

type Lang = 'vi' | 'en';

type ClientsTestimonials = {
    home: {
        clientsTestimonials: {
            title: string;
            titleDes: string;
            card: {
                card1title: string;
                card1des: string;
                card2title: string;
                card2des: string;
                card3title: string;
                card3des: string;
                card4title: string;
                card4des: string;
                card5title: string;
                card5des: string;
            };
        };
    };
};

const texts: Record<Lang, ClientsTestimonials> = {
    vi: {
        home: {
            clientsTestimonials: {
                title: 'Ý Kiến Phụ Huynh',
                titleDes:
                    'Các phụ huynh chia sẻ trải nghiệm khi con họ làm bài tập và học cùng giáo viên Sơn Tùng M-TP. Họ đánh giá rất cao phương pháp giảng dạy và sự hỗ trợ tận tình.',
                card: {
                    card1title: 'Phụ huynh của Sơn Tùng M-TP',
                    card1des:
                        'Nhờ sự hướng dẫn tận tâm của thầy, con tôi hoàn thành bài tập hiệu quả, học hỏi nhanh chóng và tự tin hơn mỗi ngày.',
                    card2title: 'Phụ huynh của Minh Anh',
                    card2des:
                        'Con tôi thấy các bài tập thú vị và dễ hiểu hơn, giúp cải thiện kỹ năng nhanh chóng.',
                    card3title: 'Phụ huynh của Thuỳ Linh',
                    card3des:
                        'Tôi rất hài lòng cách thầy giải thích chi tiết, giúp con nắm chắc kiến thức và áp dụng tốt.',
                    card4title: 'Phụ huynh của Hoàng Nam',
                    card4des:
                        'Nhờ hướng dẫn của thầy, con tôi tự tin hơn khi làm bài tập và đối mặt các thử thách.',
                    card5title: 'Phụ huynh của Ngọc Mai',
                    card5des:
                        'Phương pháp học vừa hiệu quả vừa sáng tạo, giúp con tôi hứng thú với việc học mỗi ngày.',
                },
            },
        },
    },
    en: {
        home: {
            clientsTestimonials: {
                title: 'Parent Testimonials',
                titleDes:
                    'Parents share their experiences observing their children completing assignments and learning with teacher Sơn Tùng M-TP. They highly appreciate his teaching methods and support.',
                card: {
                    card1title: 'Parent of Son Tung M-TP',
                    card1des:
                        'Thanks to his dedicated guidance, my child completes assignments efficiently, learns quickly, and gains confidence every day.',
                    card2title: 'Parent of Minh Anh',
                    card2des:
                        'My child finds the assignments engaging and easy to understand, helping improve skills rapidly.',
                    card3title: 'Parent of Thuy Linh',
                    card3des:
                        'I am very pleased with the detailed explanations, which help my child grasp concepts and apply them effectively.',
                    card4title: 'Parent of Hoang Nam',
                    card4des:
                        'With his guidance, my child feels more confident tackling assignments and challenges.',
                    card5title: 'Parent of Ngoc Mai',
                    card5des:
                        'The learning methods are effective and creative, making my child excited to study every day.',
                },
            },
        },
    },
};

function getTextsForLang(lang: string): ClientsTestimonials {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default function ClientsTestimonials({ lang }: { lang: 'vi' | 'en' }) {
    const textsForLang = getTextsForLang(lang);

    const clients: Client[] = [
        {
            id: 0,
            name: textsForLang.home.clientsTestimonials.card.card1title,
            text: textsForLang.home.clientsTestimonials.card.card1des,
            imgUrl: 'https://picsum.photos/seed/1/200/300',
            borderColor: '#F0AA00',
        },
        {
            id: 1,
            name: textsForLang.home.clientsTestimonials.card.card2title,
            text: textsForLang.home.clientsTestimonials.card.card2des,
            imgUrl: 'https://picsum.photos/seed/2/200/300',
            borderColor: '#A5C347',
        },
        {
            id: 2,
            name: textsForLang.home.clientsTestimonials.card.card3title,
            text: textsForLang.home.clientsTestimonials.card.card3des,
            imgUrl: 'https://picsum.photos/seed/3/200/300',
            borderColor: '#8700FF',
        },
        {
            id: 3,
            name: textsForLang.home.clientsTestimonials.card.card4title,
            text: textsForLang.home.clientsTestimonials.card.card4des,
            imgUrl: 'https://picsum.photos/seed/4/200/300',
            borderColor: '#FF3075',
        },
        {
            id: 4,
            name: textsForLang.home.clientsTestimonials.card.card5title,
            text: textsForLang.home.clientsTestimonials.card.card5des,
            imgUrl: 'https://picsum.photos/seed/5/200/300',
            borderColor: '#3a65fd',
        },
    ];

    const [selectedId, setSelectedId] = useState(0);
    const selectedClient = clients.find((c) => c.id === selectedId)!;

    useEffect(() => {
        animateClients(selectedId);
    }, [selectedId]);

    useEffect(() => {
        initScrollAnimations();
    }, []);

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center px-8 md:px-4 py-20 md:py-0">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-start h-full max-w-6xl w-full">
                {/* Left: Testimonial */}
                <div className="space-y-12">
                    <div className="space-y-6 scroll-animate">
                        <h3 className=" text-2xl lg:text-5xl font-semibold">
                            {textsForLang.home.clientsTestimonials.title}
                        </h3>
                        <p className="md:min-h-[100] lg:text-lg text-justify text-gray-500">
                            {textsForLang.home.clientsTestimonials.titleDes}
                        </p>
                    </div>

                    <div
                        className="testimonial-card scroll-animate text-white py-10 px-8 flex flex-col justify-center gap-6 rounded-xl relative w-full min-h-[220px] transition-all duration-500 ease-in-out"
                        data-color={selectedClient.borderColor}
                    >
                        <div
                            className="quote-icon absolute top-0 right-[10%] w-16 h-16 bg-white border-2 rounded-full flex items-center justify-center -translate-y-1/2"
                            data-color={selectedClient.borderColor}
                        >
                            <svg
                                className="w-9 h-9 transition-colors duration-500"
                                viewBox="0 0 24 24"
                                fill={selectedClient.borderColor}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M7.17 6.17C6.06 7.28 5.5 8.77 5.5 10.5c0 1.72 0.56 3.22 1.67 4.33 1.11 1.11 2.61 1.67 4.33 1.67v-2c-1.01 0-1.98-0.39-2.71-1.12-0.73-0.73-1.12-1.7-1.12-2.71s0.39-1.98 1.12-2.71l-2-2zm8 0C14.06 7.28 13.5 8.77 13.5 10.5c0 1.72 0.56 3.22 1.67 4.33 1.11 1.11 2.61 1.67 4.33 1.67v-2c-1.01 0-1.98-0.39-2.71-1.12-0.73-0.73-1.12-1.7-1.12-2.71s0.39-1.98 1.12-2.71l-2-2z" />
                            </svg>
                        </div>

                        <h3 className="text-3xl font-semibold transition-opacity duration-500">
                            {selectedClient.name}
                        </h3>
                        <p className="text-justify text-lg transition-opacity duration-500 lg:min-h-0 min-h-[92]">
                            {selectedClient.text}
                        </p>
                    </div>
                </div>

                {/* Right: Clients grid */}
                <div className="grid grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="client-img scroll-animate relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-md border-4 transition-all duration-500"
                            data-id={client.id}
                            data-color={client.borderColor}
                            onClick={() => setSelectedId(client.id)}
                        >
                            <Image
                                src={client.imgUrl}
                                alt={client.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
