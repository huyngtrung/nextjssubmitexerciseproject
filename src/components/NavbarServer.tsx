import { getCurrentUser } from '@/services/clerk';
import { canAccessAdminPages } from '@/permissions/general';
import NavbarClient from './NavbarClient';

export default async function NavbarServer() {
    const user = await getCurrentUser({ allData: true });

    const isAdmin = user?.user?.role === 'admin';

    if (!canAccessAdminPages({ role: user?.user?.role as 'user' | 'admin' | undefined }))
        return null;

    return <NavbarClient isAdmin={isAdmin} />;
}
