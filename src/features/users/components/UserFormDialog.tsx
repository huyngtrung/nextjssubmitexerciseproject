// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { ReactNode, useState } from 'react';
// import { UserForm } from './UserForm';
// import { UserRole } from '@/drizzle/schema';

// export function UserFormDialog({
//     classroomId,
//     user,
//     children,
// }: {
//     classroomId: string;
//     user?: { id: string; name: string; clerkUserId?: string; email: string; role: UserRole };
//     children: ReactNode;
// }) {
//     const [isOpen, setIsOpen] = useState(false);
//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             {children}
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle className="cursor-pointer">
//                         {user == null ? 'New user' : `Edit ${user.name}`}
//                     </DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-4 ">
//                     <UserForm
//                         user={user}
//                         classroomId={classroomId}
//                         onSucess={() => setIsOpen(false)}
//                     ></UserForm>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
