import { UserRole } from '@/drizzle/schema';

export function canCreateUsers({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canUpdateUsers({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}

export function canDeleteUsers({ role }: { role: UserRole | undefined }) {
    return role === 'admin';
}
