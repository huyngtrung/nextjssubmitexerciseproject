'use client';

import { actionToast } from '@/lib/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RequiredLabelIcon } from '@/components/RequiredLabelIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/drizzle/schema';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createUser, updateUserAction } from '../actions/users';
import { userSchema } from '../schemas/users';
import { MultiSelect } from '@/components/ui/custom/multi-select';

type Lang = 'vi' | 'en';

type StudentTableTexts = {
    input: {
        title: string;
        lastName: string;
        role: string;
        firstName: string;
        email: string;
        includedClassrooms: string;
    };
    save: string;
};

const texts: Record<Lang, StudentTableTexts> = {
    vi: {
        input: {
            title: 'Tên Học Sinh',
            lastName: 'Họ',
            role: 'Vai Trò',
            firstName: 'Tên Riêng',
            email: 'Email',
            includedClassrooms: 'Lớp Học',
        },
        save: 'Lưu',
    },
    en: {
        input: {
            title: 'Name',
            lastName: 'Last Name',
            role: 'Role',
            firstName: 'First Name',
            email: 'Email',
            includedClassrooms: 'Inclued Classrooms',
        },
        save: 'Save',
    },
};

function getTextsForLang(lang: string): StudentTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function UserForm({
    user,
    classrooms,
    onSucess,
    lang,
}: {
    user?: {
        id: string;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        clerkUserId?: string;
        email: string;
        role: UserRole;
        classes?: {
            classId: string;
            name: string;
            description: string;
            order?: number;
        }[];
    };
    classrooms?: { id: string; name: string; description: string }[];
    onSucess?: () => void;
    lang: 'vi' | 'en';
}) {
    const textsForLang = getTextsForLang(lang);

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user?.name ?? '',
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
            role: user?.role ?? 'user',
            classroomIds: user?.classes?.map((c) => c.classId) ?? [],
        },
    });

    async function handleOnSubmit(values: z.infer<typeof userSchema>) {
        const classIds = values.classroomIds;

        const action =
            user == null
                ? createUser.bind(null, classIds)
                : updateUserAction.bind(null, user.clerkUserId!);
        const data = await action(values, lang);
        actionToast({ actionData: data });

        if (!data.error) onSucess?.();
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
                className="flex gap-6 flex-col @container"
            >
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.title}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.firstName}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    {textsForLang.input.lastName}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.email}
                                </FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} disabled={!!user} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.role}
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['user', 'admin'].map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="classroomIds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{textsForLang.input.includedClassrooms}</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        selectPlaceholder="Select classrooms"
                                        searchPlaceholder="Search classrooms"
                                        options={classrooms ?? []}
                                        getLabel={(c) => c.name}
                                        getValue={(c) => c.id}
                                        selectedValues={field.value}
                                        onSelectedValuesChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="self-end">
                    <Button disabled={form.formState.isSubmitting} type="submit">
                        {textsForLang.save}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
