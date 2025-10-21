'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { classSchema } from '../schemas/classrooms';
import z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { actionToast } from '@/lib/use-toast';
import { createClassroom, updateClassroom } from '../actions/classrooms';
import { RequiredLabelIcon } from '@/components/RequiredLabelIcon';

type Lang = 'vi' | 'en';

type ClassroomTableTexts = {
    input: {
        title: string;
        description: string;
    };
    save: string;
};

const texts: Record<Lang, ClassroomTableTexts> = {
    vi: {
        input: {
            title: 'Tên lớp học',
            description: 'Mô tả cho lớp học',
        },
        save: 'Lưu',
    },
    en: {
        input: {
            title: 'Name',
            description: 'Description',
        },
        save: 'Save',
    },
};

function getTextsForLang(lang: string): ClassroomTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function ClassroomForm({
    classroom,
    lang,
}: {
    classroom?: {
        id: string;
        name: string;
        description: string;
    };
    lang: 'vi' | 'en';
}) {
    const textsForLang = getTextsForLang(lang);

    const form = useForm<z.infer<typeof classSchema>>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: classroom?.name ?? '',
            description: classroom?.description ?? '',
        },
    });

    async function handleOnSubmit(values: z.infer<typeof classSchema>) {
        const action =
            classroom == null
                ? createClassroom.bind(null, lang)
                : updateClassroom.bind(null, classroom.id, lang);
        const data = await action(values);

        actionToast({ actionData: data });
    }

    const handleOnInvalid = () => {
        actionToast({
            actionData: {
                error: true,
                message:
                    lang === 'vi'
                        ? 'Vui lòng điền đầy đủ thông tin'
                        : 'Please fill out all required fields.',
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleOnSubmit, handleOnInvalid)}
                className="flex gap-6 flex-col"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon /> {textsForLang.input.title}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    autoFocus
                                    {...field}
                                    className="focus-visible:ring-ring/80 focus-visible:ring-[1px]"
                                ></Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon /> {textsForLang.input.description}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="min-h-20 resize-none focus-visible:ring-ring/80 focus-visible:ring-[1px]"
                                    {...field}
                                ></Textarea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full sm:w-auto self-end">
                    <Button
                        className="w-full sm:w-auto cursor-pointer px-12"
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >
                        {textsForLang.save}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
