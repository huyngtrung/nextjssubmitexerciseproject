import { userRoles } from '@/drizzle/schema';
import z from 'zod';

export const userSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .refine(
            (val) => !/\s/.test(val), // kiểm tra không có khoảng trắng
            'Name cannot contain spaces',
        ),
    email: z.string().email('Invalid email'),
    firstName: z.string().min(1, 'required'),
    lastName: z.string().min(1, 'required'),
    role: z.enum(userRoles),
    classroomIds: z.array(z.string()).min(1, 'Please select at least one classroom'),
});
