'use client';
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
import { FileTextIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { deleteExerciseAction, viewFileExerciseAction } from '../actions/exercises';
import { ActionUrlButton } from '@/components/ActionUrlButton';
import { useState } from 'react';
import { useDebouncedSearch } from '@/lib/useDebouncedSearch';
import { Input } from '@/components/ui/input';

interface SearchResult {
    id: string;
    name: string;
    description?: string;
    usersCount: number;
    exercisesCount: number;
}

type Lang = 'vi' | 'en';

type ExerciseTableTexts = {
    tableHead: {
        title1: { singular: string; plural: string };
        title2: string;
        title3: string;
        title4: string;
    };
    action: { edit: string; delete: string; viewFile: string };
};

const texts: Record<Lang, ExerciseTableTexts> = {
    vi: {
        tableHead: {
            title1: { singular: 'Bài Tập', plural: 'Bài Tập' },
            title2: 'Danh Sách Lớp Học',
            title3: 'Thao Tác',
            title4: 'Tập Tin',
        },
        action: { edit: 'Sửa', delete: 'Xóa', viewFile: 'Xem File' },
    },
    en: {
        tableHead: {
            title1: { singular: 'Exercise', plural: 'Exercises' },
            title2: 'Classrooms',
            title3: 'Actions',
            title4: 'File',
        },
        action: { edit: 'Edit', delete: 'Delete', viewFile: 'View File' },
    },
};

function getTextsForLang(lang: string): ExerciseTableTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export function ExerciseTableComponent({
    exercises,
    lang,
}: {
    exercises: {
        id: string;
        name: string;
        description: string;
        dueDate: Date | null;
        maxScore: number | null;
        subject: string;
        s3key?: string | null;
        classes?: { id: string; name: string; description: string }[];
    }[];
    lang: 'vi' | 'en';
}) {
    const textsForLang = getTextsForLang(lang);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResults, loading: isSearching } = useDebouncedSearch<SearchResult>(
        searchQuery,
        '/api/exercises/search',
        300,
    );

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const displayedExercises =
        searchQuery.trim() === ''
            ? exercises
            : searchResults.map((item) => ({
                  id: item.id,
                  name: item.name,
                  description: item.description ?? '',
                  usersCount: item.usersCount ?? 0,
                  exercisesCount: item.exercisesCount ?? 0,
              }));
    const totalPages = Math.ceil(exercises.length / rowsPerPage);
    const paginatedExercises = displayedExercises.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
    );

    const goToPage = (page: number) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        setCurrentPage(page);
    };

    return (
        <>
            <div className="mb-6">
                <Input
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // reset page khi search
                    }}
                    placeholder={lang === 'vi' ? 'Tìm Bài Tập...' : 'Search exercises...'}
                    className="max-w-sm"
                />
            </div>
            {isSearching && <p>{lang === 'vi' ? 'Đang tìm...' : 'Searching...'}</p>}
            <Table className="border-[1px] border-gray-300 rounded-md">
                <TableHeader className="bg-muted/50">
                    <TableRow className="text-sm font-semibold text-foreground">
                        <TableHead>
                            {formatPlural(exercises.length, {
                                singular: textsForLang.tableHead.title1.singular,
                                plural: textsForLang.tableHead.title1.plural,
                            })}
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            {textsForLang.tableHead.title2}
                        </TableHead>
                        <TableHead className="text-center">
                            {textsForLang.tableHead.title4}
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                            {textsForLang.tableHead.title3}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedExercises.map((exercise) => (
                        <TableRow key={exercise.id}>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">{exercise.name}</div>
                                </div>
                            </TableCell>
                            {/* <TableCell className="text-center text-sm text-foreground">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {exercise.classes?.map((cls) => (
                                        <span
                                            key={cls.id}
                                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                                        >
                                            {cls.name}
                                        </span>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {exercise.s3key ? (
                                    <ActionUrlButton
                                        variant="outline"
                                        action={viewFileExerciseAction.bind(
                                            null,
                                            exercise.id,
                                            lang,
                                        )}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex gap-2 justify-center items-center text-blue-600">
                                            <FileTextIcon className="w-4 h-4" />
                                            {getFileNameFromS3Key(exercise.s3key) ??
                                                textsForLang.action.viewFile}
                                        </div>
                                    </ActionUrlButton>
                                ) : (
                                    <span className="text-gray-400 italic">No file</span>
                                )}
                            </TableCell> */}
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2 items-center">
                                    <Button asChild>
                                        <Link href={`/${lang}/admin/exercises/${exercise.id}/edit`}>
                                            {textsForLang.action.edit}
                                        </Link>
                                    </Button>
                                    <ActionButton
                                        variant="destructive"
                                        requireAreYouSure
                                        action={deleteExerciseAction.bind(null, exercise.id, lang)}
                                        className="cursor-pointer"
                                    >
                                        <Trash2Icon />
                                        <span className="sr-only">
                                            {textsForLang.action.delete}
                                        </span>
                                    </ActionButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i}
                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </Button>
                </div>
            )}
        </>
    );
}

function getFileNameFromS3Key(s3Key: string | undefined): string {
    if (!s3Key) return '';

    let fullFileName: string;

    if (s3Key.startsWith('exercises/')) {
        const withoutPrefix = s3Key.replace(/^exercises\//, '');
        const prefixLength = 57;
        fullFileName = withoutPrefix.slice(prefixLength);
    } else {
        fullFileName = s3Key;
    }

    const MAX_LENGTH_THRESHOLD = 20;
    const START_CHARS = 10;
    const END_CHARS = 8;

    if (fullFileName.length > MAX_LENGTH_THRESHOLD) {
        return fullFileName.slice(0, START_CHARS) + '...' + fullFileName.slice(-END_CHARS);
    }

    return fullFileName;
}
