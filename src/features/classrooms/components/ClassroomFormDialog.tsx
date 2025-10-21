'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CourseSectionStatus } from '@/drizzle/schema';
import { ReactNode, useState } from 'react';
import { SectionForm } from './SectionForm';

export function SectionFormDialog({
    courseId,
    section,
    children,
}: {
    courseId: string;
    section?: { id: string; name: string; status: CourseSectionStatus };
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="cursor-pointer">
                        {section == null ? 'New section' : `Edit ${section.name}`}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 ">
                    <SectionForm
                        section={section}
                        courseId={courseId}
                        onSucess={() => setIsOpen(false)}
                    ></SectionForm>
                </div>
            </DialogContent>
        </Dialog>
    );
}
