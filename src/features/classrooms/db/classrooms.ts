import { db } from '@/drizzle/db';
import { ClassesTable } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidateClassroomCache } from './cache/classrooms';

export async function getNextClassroomOrder() {
    const section = await db
        .select({ order: ClassesTable.order })
        .from(ClassesTable)
        .orderBy(desc(ClassesTable.order))
        .limit(1);

    return section[0] ? section[0].order + 1 : 0;
}

export async function insertClass(data: typeof ClassesTable.$inferInsert) {
    await db.insert(ClassesTable).values(data);

    const inserted = await db
        .select()
        .from(ClassesTable)
        .where(eq(ClassesTable.name, data.name))
        .orderBy(ClassesTable.id)
        .limit(1);

    const newClass = inserted[0];

    if (newClass == null) throw new Error('Failed to create Class');

    revalidateClassroomCache(newClass.id);

    return newClass;
}

export async function updateClassDb(id: string, data: typeof ClassesTable.$inferInsert) {
    await db.update(ClassesTable).set(data).where(eq(ClassesTable.id, id));

    const updatedClass = await db
        .select()
        .from(ClassesTable)
        .where(eq(ClassesTable.id, id))
        .then((rows) => rows[0]);

    if (updatedClass == null) throw new Error('Failed to update Class');

    revalidateClassroomCache(updatedClass.id);

    return updatedClass;
}

export async function deleteclassroom(id: string) {
    //Delete class
    const deletedclass = await db
        .select()
        .from(ClassesTable)
        .where(eq(ClassesTable.id, id))
        .then((rows) => rows[0]);

    if (deletedclass == null) throw new Error('Failed to delete class');

    // 2. Xoá class
    await db.delete(ClassesTable).where(eq(ClassesTable.id, id));

    // 3. Gọi hàm cache cleanup
    revalidateClassroomCache(deletedclass.id);

    return deletedclass;
}
