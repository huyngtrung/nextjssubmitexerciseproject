import { ReactNode, Suspense } from 'react';
import Footer from '@/components/Footer';
import NavbarAdmin from '@/components/NavbarAdmin';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="overflow-x-hidden">
            <Suspense fallback={null}>
                <NavbarAdmin />
            </Suspense>

            {children}

            <Footer />
        </div>
    );
}
