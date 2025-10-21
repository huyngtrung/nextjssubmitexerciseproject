// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { ReactNode, useState } from 'react';
// import { ExerciseForm } from './ExerciseForm';

// export function ExerciseFormDialog({
//     classroomId,
//     exercise,
//     children,
// }: {
//     classroomId: string;
//     exercise?: {
//         id: string;
//         name: string;
//         description: string;
//         subjectName: string;
//         dueDate?: Date;
//         maxScore?: number;
//     };
//     children: ReactNode;
// }) {
//     const [isOpen, setIsOpen] = useState(false);
//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             {children}
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle className="cursor-pointer">
//                         {exercise == null ? 'New exercise' : `Edit ${exercise.name}`}
//                     </DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-4 ">
//                     <ExerciseForm
//                         exercise={exercise}
//                         classroomId={classroomId}
//                         onSucess={() => setIsOpen(false)}
//                     ></ExerciseForm>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
