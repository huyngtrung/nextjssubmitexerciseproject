import { int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { ExerciseClassesTable } from './exerciseClasses';
import { UserClassesTable } from './userclasses';

export const ClassesTable = mysqlTable('classes', {
    id,
    name: text('name').notNull(),
    description: text('description').notNull(),
    order: int('order').notNull(),
    createdAt,
    updatedAt,
});

export const ClassesRelationships = relations(ClassesTable, ({ many }) => ({
    userClasses: many(UserClassesTable),
    exerciseClasses: many(ExerciseClassesTable),
}));
