'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function PageHeader({
    title,
    description,
    children,
    className,
}: {
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between',
                className,
            )}
        >
            <div>
                <h1 className="animate-slide-left text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="animate-slide-left text-sm text-muted-foreground mt-2">
                        {description}
                    </p>
                )}
            </div>

            {children && <div className="mt-2 sm:mt-0">{children}</div>}
        </div>
    );
}
