'use client';

import { useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { MenuIcon } from 'lucide-react';

interface SlidePanelProps {
    title: string;
    examType?: string[];
    generalFeedback?: string;
    data?: { id: number; question: string; aiAnswer: string; type: string }[];
    open: boolean;
    onOpenChange: (val: boolean) => void;
}

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function RightSlidePanel({
    title,
    examType = [],
    generalFeedback,
    data = [],
    open,
    onOpenChange,
}: SlidePanelProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const baseImages = [
        'geography',
        'pen',
        'pencil',
        'school-bag',
        'stationery',
        'student',
        'studentBoy',
        'school',
        'books',
    ];

    const sheetImagesWithPosition = useMemo(() => {
        const tempImages: string[] = [];
        tempImages.push(...baseImages);
        while (tempImages.length < 24) {
            const randomIndex = Math.floor(Math.random() * baseImages.length);
            tempImages.push(baseImages[randomIndex]!);
        }

        for (let i = tempImages.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(i + 1) * (i + 1));
            [tempImages[i], tempImages[j]] = [tempImages[j]!, tempImages[i]!];
        }

        const cols = Math.ceil(Math.sqrt(tempImages.length));
        const rows = Math.ceil(tempImages.length / cols);

        return tempImages.map((img, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);

            const cellWidth = 100 / cols;
            const cellHeight = 80 / rows;

            const baseLeft = col * cellWidth + cellWidth / 2;
            const baseTop = row * cellHeight + cellHeight / 2;

            const offsetLeft = (seededRandom(idx * 10 + 1) - 0.5) * (cellWidth / 1.5);
            const offsetTop = (seededRandom(idx * 20 + 2) - 0.5) * (cellHeight / 1.5);

            const left = baseLeft + offsetLeft;
            const top = baseTop + offsetTop;
            const size = 50 + Math.floor(seededRandom(idx * 30 + 3) * 50);
            const rotate = (seededRandom(idx * 40 + 4) - 0.5) * 30;

            return { img, top, left, size, rotate };
        });
    }, []);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <div className="fixed top-1/2 py-20 right-0 transform -translate-y-1/2 px-2 bg-[#8908F7] text-white font-bold rounded-l-4xl shadow-xl cursor-pointer transition-all duration-200 hover:bg-[#7206d9] hover:shadow-2xlz-50">
                    <MenuIcon className="w-6 h-6" />
                </div>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[80vw] h-screen px-8 !overflow-auto !max-w-none border-l-4 border-[#A5C347] !overflow-x-none"
            >
                {sheetImagesWithPosition.map(({ img, top, left, size, rotate }, idx) => (
                    <div
                        key={idx}
                        className="absolute pointer-events-none z-0 opacity-30"
                        style={{
                            top: `${top}%`,
                            left: `${left}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                        }}
                    >
                        <Image
                            src={`/exerciseimgs/panel/${img}.png`}
                            alt={img}
                            width={size}
                            height={size}
                            className="object-contain"
                        />
                    </div>
                ))}

                <SheetHeader className="pt-8 px-0 pb-0">
                    <SheetTitle className="text-3xl p-0 m-0">{title}</SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    {data.length === 0 ? (
                        <div className="text-gray-400 text-center mt-10">
                            {generalFeedback ? (
                                generalFeedback
                            ) : (
                                <div className="text-2xl"> Hãy bắt đầu làm bài tập ngay nào...</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {examType.map((type) => {
                                const questionsOfType = data
                                    .filter((q) => q.type === type)
                                    .sort((a, b) => a.id - b.id);

                                if (questionsOfType.length === 0) return null;

                                return (
                                    <div key={type} className="flex flex-col gap-2">
                                        <div className="text-lg font-semibold">{type}</div>
                                        <div className="flex flex-wrap gap-3">
                                            {questionsOfType.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-1 transition
                                                        ${selectedId === q.id ? 'bg-[#A5C347] text-black/70 border-black/40' : 'bg-gray-200 text-gray-700 border-gray-300'}
                                                    `}
                                                    onClick={() =>
                                                        setSelectedId(
                                                            q.id === selectedId ? null : q.id,
                                                        )
                                                    }
                                                >
                                                    {q.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {selectedId && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm transition">
                                    <div className="font-semibold mb-2">
                                        Câu {selectedId}:{' '}
                                        {data.find((d) => d.id === selectedId)?.question}
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                data.find((d) => d.id === selectedId)?.aiAnswer ||
                                                '',
                                        }}
                                    />
                                </div>
                            )}
                            {!selectedId && generalFeedback && (
                                <div className="p-4 bg-yellow-50 rounded-lg shadow-sm text-gray-800">
                                    <strong>Nhận xét chung:</strong> {generalFeedback}
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
