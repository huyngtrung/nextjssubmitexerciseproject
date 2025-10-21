'use client';

import { ComponentPropsWithRef, ReactNode, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { actionToast } from '@/lib/use-toast';

export function ActionButton({
    action,
    requireAreYouSure = false,
    ...props
}: Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> & {
    action: () => Promise<{ error: boolean; message: string }>;
    requireAreYouSure?: boolean;
}) {
    const [isLoading, startTransition] = useTransition();
    function performAction() {
        startTransition(async () => {
            const data = await action();

            actionToast({ actionData: data });
        });
    }

    const [open, setOpen] = useState(false);

    if (requireAreYouSure) {
        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button {...props} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer hover:bg-red-600  text-white px-4 py-2 rounded"
                            disabled={isLoading}
                            onClick={performAction}
                        >
                            <LoadingTextSwap isLoading={isLoading}>Yes</LoadingTextSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Button {...props} disabled={isLoading} onClick={performAction}>
            <LoadingTextSwap isLoading={isLoading}>{props.children}</LoadingTextSwap>
        </Button>
    );
}

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
