import { UserRole } from '@/drizzle/schema';

export function canCreateClassrooms({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canUpdateClassrooms({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canDeleteClassrooms({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}
