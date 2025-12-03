'use client';

import { ComponentPropsWithRef, ReactNode, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { actionToast } from '@/lib/use-toast';
// Giả định bạn đã định nghĩa ActionData bao gồm 'url'
interface ActionData {
    error: boolean;
    message: string;
    url?: string; // Đã thêm url
}

// Hàm LoadingTextSwap từ ActionButton của bạn
function LoadingTextSwap({ isLoading, children }: { isLoading: boolean; children: ReactNode }) {
    return (
        <div className="grid items-center justify-items-center">
            <div
                className={cn(
                    'col-start-1 col-end-2 row-start-1 row-end-2 text-center',
                    isLoading ? 'invisible' : 'visible',
                )}
            >
                {children}
            </div>
            <div
                className={cn(
                    'col-start-1 col-end-2 row-start-1 row-end-2 text-center',
                    isLoading ? 'visible' : 'invisible',
                )}
            >
                <Loader2Icon className="animate-spin"></Loader2Icon>
            </div>
        </div>
    );
}

export function ActionUrlButton({
    action,
    ...props
}: Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> & {
    // Action phải trả về object có chứa url
    action: () => Promise<ActionData>;
}) {
    const [isLoading, startTransition] = useTransition();

    function performAction() {
        startTransition(async () => {
            const data = await action();

            // **LOGIC ĐÃ ĐIỀU CHỈNH TẠI ĐÂY**
            if (!data.error && data.url) {
                // 1. Nếu KHÔNG có lỗi và có URL, mở URL trong tab mới ngay lập tức.
                window.open(data.url, '_blank');

                // Bạn có thể tùy chọn thêm một toast báo hiệu việc mở link
                // (thường không cần thiết vì người dùng sẽ thấy tab mới hiện ra)
                // actionToast({ actionData: { error: false, message: 'Đang mở file...' } });
            } else {
                // 2. Nếu có lỗi hoặc không có URL, hiển thị toast thông báo lỗi.
                actionToast({ actionData: data });
            }
        });
    }

    return (
        <Button {...props} disabled={isLoading} onClick={performAction}>
            <LoadingTextSwap isLoading={isLoading}>{props.children}</LoadingTextSwap>
        </Button>
    );
}
