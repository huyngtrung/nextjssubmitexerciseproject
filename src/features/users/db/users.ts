import { db } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidateUserCache } from './cache';

export async function insertUser(data: typeof UserTable.$inferInsert) {
    try {
        await db.insert(UserTable).values(data).onDuplicateKeyUpdate({ set: data });

        const [newUser] = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.clerkUserId, data.clerkUserId));

        if (!newUser) {
            throw new Error('Failed to create user');
        }
        revalidateUserCache(newUser.id);

        return newUser;
    } catch (err) {
        throw err;
    }
}

export async function updateUser(
    { clerkUserId }: { clerkUserId: string },
    data: Partial<typeof UserTable.$inferInsert>,
) {
    await db.update(UserTable).set(data).where(eq(UserTable.clerkUserId, clerkUserId));

    const [updatedUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.clerkUserId, clerkUserId));

    if (!updatedUser) throw new Error('Failed to update user');
    revalidateUserCache(updatedUser.id);

    return updatedUser;
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
    const timestamp = Date.now();
    const deletedClerkId = `deleted_${timestamp}`;

    try {
        await db
            .update(UserTable)
            .set({
                deletedAt: new Date(),
                email: `deleted_${timestamp}@deleted.com`,
                name: `Deleted User ${timestamp}`,
                clerkUserId: deletedClerkId,
                imageUrl: null,
            })
            .where(eq(UserTable.clerkUserId, clerkUserId));

        const [deletedUser] = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.clerkUserId, deletedClerkId));

        if (!deletedUser) {
            throw new Error('Failed to retrieve deleted user');
        }

        revalidateUserCache(deletedUser.id);

        return deletedUser;
    } catch (err) {
        console.error('❌ Error in deleteUser():', err);
        throw err;
    }
}
