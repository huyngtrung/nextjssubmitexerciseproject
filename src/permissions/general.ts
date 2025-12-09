import { UserRole } from '@/drizzle/schema';

// export function canAccessAdminPages({ role }: { role: UserRole | undefined }) {
//     return role === 'admin';
// }

// Loại bỏ hủy cấu trúc và nhận đối tượng đầy đủ
export function canAccessAdminPages(user: { role: UserRole | undefined } | null | undefined) {
    // Kiểm tra xem user có tồn tại và có thuộc tính role không
    const role = user?.role;

    return role === 'admin';
}
