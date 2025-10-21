import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPlural } from '@/lib/formatters';
import { Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { deleteclassroom } from '../actions/classrooms';

type Lang = 'vi' | 'en';

type ClassroomTableTexts = {
    tableHead: {
        title1: {
            singular: string;
            plural: string;
        };
        title2: string;
        title3: string;
        title4: string;
    };
    action: {
        edit: string;
        delete: string;
    };
};

const texts: Record<Lang, ClassroomTableTexts> = {
    vi: {
        tableHead: {
            title1: {
                singular: 'Lớp Học',
                plural: 'Lớp Học',
            },
            title2: 'Số Lượng Học Sinh',
            title3: 'Số Lượng Bài Tập',
            title4: 'Thao Tác',
        },
        action: {
            edit: 'Sửa',
            delete: 'Xóa',
        },
    },
    en: {
        tableHead: {
            title1: {
                singular: 'Classroom',
                plural: 'Classrooms',
            },
            title2: 'Students',
            title3: 'Exercises',
            title4: 'Actions',
        },
        action: {
            edit: 'Edit',
            delete: 'Delete',
        },
    },
};

function getTextsForLang(lang: string): ClassroomTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function ClassroomTable({
    classrooms,
    lang,
}: {
    classrooms: {
        id: string;
        name: string;
        description: string;
        usersCount: number;
        exercisesCount: number;
    }[];
    lang: 'vi' | 'en';
}) {
    const textsForLang = getTextsForLang(lang);

    return (
        <Table className="border-[1px] border-gray-300 rounded-md">
            <TableHeader className="bg-muted/50">
                <TableRow className="text-sm font-semibold text-foreground">
                    <TableHead>
                        {formatPlural(classrooms.length, {
                            singular: textsForLang.tableHead.title1.singular,
                            plural: textsForLang.tableHead.title1.plural,
                        })}
                    </TableHead>

                    <TableHead className="text-sm font-semibold text-foreground text-center">
                        {textsForLang.tableHead.title2}
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-center pr-6">
                        {textsForLang.tableHead.title3}
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                        {textsForLang.tableHead.title4}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {classrooms.map((classroom) => (
                    <TableRow key={classroom.id}>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <div className="font-semibold">{classroom.name}</div>
                                <div className="text-muted-foreground">
                                    {formatPlural(classroom.usersCount, {
                                        singular: 'user',
                                        plural: 'users',
                                    })}{' '}
                                    •{' '}
                                    {formatPlural(classroom.exercisesCount, {
                                        singular: 'exercise',
                                        plural: 'exercises',
                                    })}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            {classroom.usersCount}
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            {classroom.exercisesCount}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2 items-center">
                                <Button asChild>
                                    <Link href={`/${lang}/admin/classrooms/${classroom.id}/edit`}>
                                        {textsForLang.action.edit}
                                    </Link>
                                </Button>
                                <ActionButton
                                    variant="destructive"
                                    requireAreYouSure
                                    action={deleteclassroom.bind(null, classroom.id, lang)}
                                >
                                    <Trash2Icon />
                                    <span className="sr-only"> {textsForLang.action.delete}</span>
                                </ActionButton>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
