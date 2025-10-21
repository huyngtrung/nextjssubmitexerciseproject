'use client';

import { SortableItem, SortableList } from '@/components/SortableList';
import { Trash2Icon } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ActionButton } from '@/components/ActionButton';
import { deleteUserAction, updateUserOrdersAction } from '../actions/users';
import { UserFormDialog } from './UserFormDialog';
import { UserRole } from '@/drizzle/schema';

export function SortableUserList({
    classroomId,
    students,
}: {
    classroomId: string;
    students: {
        id: string;
        name: string;
        email: string;
        clerkUserId: string;
        role: UserRole;
        order?: number;
    }[];
}) {
    return (
        <SortableList
            items={students}
            onOrderChange={(newOrder) => updateUserOrdersAction(classroomId, newOrder)}
        >
            {(items) =>
                items.map((student) => (
                    <SortableItem
                        key={student.id}
                        id={student.id}
                        className="flex items-center gap-1"
                    >
                        <div>{student.name}</div>
                        <UserFormDialog user={student} classroomId={classroomId}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto cursor-pointer"
                                >
                                    Edit
                                </Button>
                            </DialogTrigger>
                        </UserFormDialog>
                        <ActionButton
                            action={deleteUserAction.bind(null, student.clerkUserId)}
                            requireAreYouSure
                            variant="destructive"
                            size="sm"
                            className="hover:text-white cursor-pointer"
                        >
                            <Trash2Icon className="cursor-pointer hover:text-black" />
                            <span className="sr-only ">Delete</span>
                        </ActionButton>
                    </SortableItem>
                ))
            }
        </SortableList>
    );
}
