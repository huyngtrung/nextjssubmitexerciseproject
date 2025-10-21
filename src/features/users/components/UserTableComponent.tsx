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
import { UserRole } from '@/drizzle/schema';
import { deleteUserAction } from '../actions/users';

type Lang = 'vi' | 'en';

type StudentTableTexts = {
    tableHead: {
        title1: {
            singular: string;
            plural: string;
        };
        title2: string;
        title3: string;
    };
    action: {
        edit: string;
        delete: string;
    };
};

const texts: Record<Lang, StudentTableTexts> = {
    vi: {
        tableHead: {
            title1: {
                singular: 'Học Sinh',
                plural: 'Học Sinh',
            },
            title2: 'Danh Sách Lớp Học',
            title3: 'Thao Tác',
        },
        action: {
            edit: 'Sửa',
            delete: 'Xóa',
        },
    },
    en: {
        tableHead: {
            title1: {
                singular: 'Student',
                plural: 'Students',
            },
            title2: 'Classrooms',
            title3: 'Actions',
        },
        action: {
            edit: 'Edit',
            delete: 'Delete',
        },
    },
};

function getTextsForLang(lang: string): StudentTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function UserTableComponent({
    students,
    lang,
}: {
    students: {
        id: string;
        clerkUserId: string;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        role: UserRole;
        email: string;
        classes?: {
            id: string;
            name: string;
            description: string;
        }[];
    }[];
    lang: 'vi' | 'en';
}) {
    const textsForLang = getTextsForLang(lang);

    return (
        <Table className="border-[1px] border-gray-300 rounded-md">
            <TableHeader className="bg-muted/50">
                <TableRow className="text-sm font-semibold text-foreground">
                    <TableHead>
                        {formatPlural(students.length, {
                            singular: textsForLang.tableHead.title1.singular,
                            plural: textsForLang.tableHead.title1.plural,
                        })}
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-center">
                        {textsForLang.tableHead.title2}
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                        {textsForLang.tableHead.title3}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <div className="font-semibold">{student.name}</div>
                                <div className="text-muted-foreground"></div>
                            </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {student.classes?.map((cls) => (
                                    <span
                                        key={cls.id}
                                        className="px-2 py-1 bg-gray-200 rounded text-sm "
                                    >
                                        {cls.name}
                                    </span>
                                ))}
                            </div>
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2 items-center">
                                <Button asChild>
                                    <Link href={`/${lang}/admin/students/${student.id}/edit`}>
                                        {textsForLang.action.edit}
                                    </Link>
                                </Button>
                                <ActionButton
                                    variant="destructive"
                                    requireAreYouSure
                                    action={deleteUserAction.bind(null, student.clerkUserId, lang)}
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
