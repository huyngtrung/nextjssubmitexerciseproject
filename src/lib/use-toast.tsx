import { toast } from 'sonner';
import { CheckCircleIcon, AlertCircleIcon } from 'lucide-react';

type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export function actionToast({
    actionData,
    ...props
}: {
    actionData: { error: boolean; message: string };
    duration?: number;
    position?: ToastPosition;
}) {
    const isError = actionData.error;

    const icon = isError ? (
        <AlertCircleIcon className="text-red-500 w-5 h-5" />
    ) : (
        <CheckCircleIcon className="text-green-500 w-5 h-5" />
    );

    return toast(
        <div className="flex flex-col gap-1 p-1.5 sm:p-2">
            <div
                className={`font-semibold text-sm sm:text-base ${
                    isError ? 'text-red-600' : 'text-green-600'
                }`}
            >
                {isError ? 'Error' : 'Success'}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">{actionData.message}</div>
        </div>,
        {
            icon,
            duration: props.duration ?? 3000,
            position: props.position ?? 'top-right',
        },
    );
}
