'use client';

import React, { useEffect, useRef } from 'react';
import { UserButton } from '@clerk/nextjs';
import { rotateFlower } from '@/lib/animations/rotateFlower';

export const UserButtonFlower: React.FC<{ size?: number }> = ({ size = 20 }) => {
    const flowerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        rotateFlower(flowerRef.current, 8); // 8s cho 1 vòng
    }, []);

    const numPetals = 12;
    const radius = size; // bán kính vòng hoa
    const petalSize = size / 3;

    const colors = [
        '#A5C347',
        '#FF236C',
        '#00D2DC',
        '#5D58EF',
        '#F0AA00',
        '#8800FF',
        '#A5C347',
        '#FF236C',
        '#00D2DC',
        '#5D58EF',
        '#F0AA00',
        '#8800FF',
    ];

    const petals = Array.from({ length: numPetals }).map((_, i) => {
        const angle = (i / numPetals) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { x, y, color: colors[i % colors.length], angle };
    });

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size * 2, height: size * 2 }}
        >
            {/* Container xoay các cánh hoa */}
            <div
                ref={flowerRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformOrigin: 'center center' }}
            >
                {petals.map((p, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            width: petalSize,
                            height: petalSize * 1.5,
                            background: p.color,
                            borderRadius: '50%',
                            left: `calc(50% + ${p.x}px - ${petalSize / 2}px)`,
                            top: `calc(50% + ${p.y}px - ${petalSize * 0.75}px)`,
                            transform: `rotate(${p.angle}rad)`,
                            transformOrigin: 'center center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                    />
                ))}
            </div>

            {/* UserButton ở giữa */}
            <div
                className="absolute flex p-4 items-center justify-center"
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    overflow: 'hidden',
                }}
            >
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: { width: '100%', height: '100%' },
                            userButtonBox: 'size-8',
                        },
                    }}
                />
            </div>
        </div>
    );
};
