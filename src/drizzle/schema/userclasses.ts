import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { UserTable } from './user';
import { ClassesTable } from './classes';
import { relations } from 'drizzle-orm';

export const UserClassesTable = mysqlTable('user_classes', {
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => UserTable.id, { onDelete: 'cascade' }),
    classId: varchar('class_id', { length: 255 })
        .notNull()
        .references(() => ClassesTable.id, { onDelete: 'cascade' }),
    order: int('order').notNull(),
});

export const UserClassesRelationships = relations(UserClassesTable, ({ one }) => ({
    user: one(UserTable, { fields: [UserClassesTable.userId], references: [UserTable.id] }),
    class: one(ClassesTable, { fields: [UserClassesTable.classId], references: [ClassesTable.id] }),
}));
