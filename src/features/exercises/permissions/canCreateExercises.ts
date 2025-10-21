import { UserRole } from '@/drizzle/schema';

export function canCreateExercises({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canUpdateExercises({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canDeleteExercises({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}
