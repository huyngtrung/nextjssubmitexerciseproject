'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { animateClients, initScrollAnimations } from '@/lib/animations/animateClientsTestimonials';
import { useLanguage } from '@/context/LanguageContext';

interface Client {
    id: number;
    name: string;
    text: string;
    imgUrl: string;
    borderColor: string;
}

export default function ClientsTestimonials() {
    const { texts } = useLanguage();

    const clients: Client[] = [
        {
            id: 0,
            name: texts.home.clientsTestimonials.card.card1title,
            text: texts.home.clientsTestimonials.card.card1des,
            imgUrl: 'https://picsum.photos/seed/1/200/300',
            borderColor: '#F0AA00',
        },
        {
            id: 1,
            name: texts.home.clientsTestimonials.card.card2title,
            text: texts.home.clientsTestimonials.card.card2des,
            imgUrl: 'https://picsum.photos/seed/2/200/300',
            borderColor: '#A5C347',
        },
        {
            id: 2,
            name: texts.home.clientsTestimonials.card.card3title,
            text: texts.home.clientsTestimonials.card.card3des,
            imgUrl: 'https://picsum.photos/seed/3/200/300',
            borderColor: '#8700FF',
        },
        {
            id: 3,
            name: texts.home.clientsTestimonials.card.card4title,
            text: texts.home.clientsTestimonials.card.card4des,
            imgUrl: 'https://picsum.photos/seed/4/200/300',
            borderColor: '#FF3075',
        },
        {
            id: 4,
            name: texts.home.clientsTestimonials.card.card5title,
            text: texts.home.clientsTestimonials.card.card5des,
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
                        <h3 className=" text-4xl lg:text-5xl font-semibold">
                            {texts.home.clientsTestimonials.title}
                        </h3>
                        <p className="md:min-h-[100] lg:text-lg text-justify text-gray-500">
                            {texts.home.clientsTestimonials.titleDes}
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
                        <p className="text-justify text-lg transition-opacity duration-500 lg:min-h-0 min-h-[88]">
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
