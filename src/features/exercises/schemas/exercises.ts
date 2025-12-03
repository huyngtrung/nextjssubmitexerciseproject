import z from 'zod';

export const exerciseSchema = z.object({
    name: z.string().min(1, 'required'),
    description: z.string().min(1, 'required'),
    subjectName: z.string().min(1, 'required'),
    dueDate: z.string().datetime({ offset: true }).or(z.string().min(1)).optional(),
    maxScore: z.number().optional(),
    classroomIds: z.array(z.string()).min(1, 'Please select at least one classroom'),
    file: z.instanceof(File).optional(),
});
