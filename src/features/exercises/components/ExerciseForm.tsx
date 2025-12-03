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

import { createExerciseAction, updateExerciseAction } from '../actions/exercises';
import { exerciseSchema } from '../schemas/exercises';
import { MultiSelect } from '@/components/ui/custom/multi-select';

type Lang = 'vi' | 'en';

type StudentTableTexts = {
    input: {
        name: string;
        subject: string;
        maxScore: string;
        description: string;
        dueDate: string;
        includedClassrooms: string;
        file: string;
    };
    save: string;
};

const texts: Record<Lang, StudentTableTexts> = {
    vi: {
        input: {
            name: 'Tên Bài Tập',
            subject: 'Môn Học',
            maxScore: 'Điểm Tối Đa',
            description: 'Mô Tả',
            dueDate: 'Ngày Đến Hạn',
            includedClassrooms: 'Lớp Học',
            file: 'Tài Liệu Bài Tập',
        },
        save: 'Lưu',
    },
    en: {
        input: {
            name: 'Name',
            subject: 'Subject',
            maxScore: 'Max Score',
            description: 'Description',
            dueDate: 'Due Date',
            includedClassrooms: 'Inclued Classrooms',
            file: 'Exercise File',
        },
        save: 'Save',
    },
};

function getTextsForLang(lang: string): StudentTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function ExerciseForm({
    exercise,
    classrooms,
    onSucess,
    lang,
}: {
    exercise?: {
        id: string;
        name: string;
        description: string;
        subjectName: string;
        dueDate?: Date;
        maxScore?: number;
        s3Key?: string;
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

    const form = useForm<z.infer<typeof exerciseSchema>>({
        resolver: zodResolver(exerciseSchema),
        defaultValues: exercise
            ? {
                  name: exercise.name,
                  description: exercise.description,
                  subjectName: exercise.subjectName,
                  dueDate: exercise.dueDate
                      ? formatDateForInput(exercise.dueDate) // chuyển giờ VN từ DB thành giá trị cho input
                      : '',
                  maxScore: exercise.maxScore ?? 0,
                  classroomIds: exercise?.classes?.map((c) => c.classId) ?? [],
                  file: undefined,
              }
            : {
                  name: '',
                  description: '',
                  subjectName: '',
                  dueDate: '',
                  maxScore: 0,
                  classroomIds: [],
                  file: undefined,
              },
    });

    async function handleOnSubmit(values: z.infer<typeof exerciseSchema>) {
        if (!exercise?.id && !values.file) {
            actionToast({
                actionData: {
                    error: true,
                    message: lang === 'vi' ? 'Vui lòng chọn file bài tập' : 'Please select a file',
                },
            });
            return;
        }
        const classIds = values.classroomIds;

        const formattedValues = {
            ...values,
            dueDate: values.dueDate ? values.dueDate.replace('T', ' ') + ':00' : undefined,
        };

        const action =
            exercise == null
                ? createExerciseAction.bind(null, classIds, formattedValues, lang)
                : updateExerciseAction.bind(null, exercise.id!, formattedValues, lang);

        const data = await action();
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
                                    <RequiredLabelIcon /> {textsForLang.input.name}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.description}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Subject */}
                    <FormField
                        control={form.control}
                        name="subjectName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon /> {textsForLang.input.subject}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Due Date */}
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => {
                            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                field.onChange(e.target.value); // giữ nguyên format YYYY-MM-DDTHH:mm
                            };

                            const preview = field.value
                                ? field.value.replace('T', ' ') // hiển thị dạng "YYYY-MM-DD HH:mm" nếu muốn
                                : '';

                            return (
                                <FormItem>
                                    <FormLabel>{textsForLang.input.dueDate}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            value={field.value || ''}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {preview && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Hạn: {preview}
                                        </p>
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    {/* Max Score */}
                    <FormField
                        control={form.control}
                        name="maxScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{textsForLang.input.maxScore}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === '' ? 0 : Number(e.target.value),
                                            )
                                        }
                                    />
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

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => {
                            const displayName =
                                field.value?.name || getFileNameFromS3Key(exercise?.s3Key);
                            return (
                                <FormItem>
                                    <FormLabel>{textsForLang.input.file}</FormLabel>
                                    <FormControl>
                                        <label className="flex items-center gap-4 cursor-pointer border border-dashed rounded-md pl-2 hover:bg-gray-50 transition">
                                            <span className="text-sm text-muted-foreground">
                                                {displayName || 'Click hoặc kéo file vào đây'}
                                            </span>
                                            <Input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={(e) =>
                                                    field.onChange(e.target.files?.[0] ?? null)
                                                }
                                            />
                                            <Button
                                                className="border-0 cursor-pointer"
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                            >
                                                Chọn file
                                            </Button>
                                        </label>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
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

function formatDateForInput(value: string | Date) {
    if (!value) return '';

    let year: string, month: string, day: string, hour: string, minute: string;

    if (typeof value === 'string') {
        // Nếu là string dạng "YYYY-MM-DD HH:mm:ss"
        const [datePart, timePart] = value.split(' ');
        if (!datePart) {
            return;
        }

        const dateParts = datePart.split('-');
        const timeParts = timePart ? timePart.split(':') : ['00', '00'];

        year = dateParts[0] ?? '1970';
        month = dateParts[1] ?? '01';
        day = dateParts[2] ?? '01';

        hour = timeParts[0] ?? '00';
        minute = timeParts[1] ?? '00';
    } else {
        // Nếu là Date object
        year = String(value.getFullYear());
        month = String(value.getMonth() + 1).padStart(2, '0');
        day = String(value.getDate()).padStart(2, '0');
        hour = String(value.getHours()).padStart(2, '0');
        minute = String(value.getMinutes()).padStart(2, '0');
    }

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getFileNameFromS3Key(s3Key: string | undefined): string {
    if (!s3Key) return '';
    // Kiểm tra exercises/ prefix
    if (!s3Key.startsWith('exercises/')) return s3Key;

    // Loại bỏ "exercises/"
    const withoutPrefix = s3Key.replace(/^exercises\//, '');

    // Xác định vị trí _ sau timestamp và UUID (UUID chuẩn 36 ký tự)
    // timestamp: 19 ký tự "YYYY-MM-DD_HH-MM-SS" + "_" + UUID: 36 ký tự + "_"
    const prefixLength = 19 + 1 + 36 + 1; // 57 ký tự
    const fileName = withoutPrefix.slice(prefixLength);

    return fileName;
}
