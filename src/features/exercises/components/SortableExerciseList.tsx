// 'use client';

// import { SortableItem, SortableList } from '@/components/SortableList';
// import { Trash2Icon } from 'lucide-react';
// import { DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ActionButton } from '@/components/ActionButton';
// import { deleteExerciseAction, updateExerciseOrdersAction } from '../actions/exercises';
// import { ExerciseFormDialog } from './ExerciseFormDialog';

// export function SortableExerciseList({
//     classroomId,
//     exercises,
// }: {
//     classroomId: string;
//     exercises: {
//         id: string;
//         name: string;
//         description: string;
//         subjectName: string;
//         dueDate?: Date;
//         maxScore?: number;
//         order?: number;
//     }[];
// }) {
//     return (
//         <SortableList
//             items={exercises}
//             onOrderChange={(newOrder) => updateExerciseOrdersAction(classroomId, newOrder)}
//         >
//             {(items) =>
//                 items.map((exercise) => (
//                     <SortableItem
//                         key={exercise.id}
//                         id={exercise.id}
//                         className="flex items-center gap-1"
//                     >
//                         <div>{exercise.name}</div>
//                         <ExerciseFormDialog exercise={exercise} classroomId={classroomId}>
//                             <DialogTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="ml-auto cursor-pointer"
//                                 >
//                                     Edit
//                                 </Button>
//                             </DialogTrigger>
//                         </ExerciseFormDialog>
//                         <ActionButton
//                             action={deleteExerciseAction.bind(null, exercise.id)}
//                             requireAreYouSure
//                             variant="destructive"
//                             size="sm"
//                             className="hover:text-white cursor-pointer"
//                         >
//                             <Trash2Icon className="cursor-pointer hover:text-black" />
//                             <span className="sr-only ">Delete</span>
//                         </ActionButton>
//                     </SortableItem>
//                 ))
//             }
//         </SortableList>
//     );
// }
