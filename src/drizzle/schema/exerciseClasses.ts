import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { ExercisesTable } from './exercises';
import { ClassesTable } from './classes';
import { relations } from 'drizzle-orm';

export const ExerciseClassesTable = mysqlTable('exercise_classes', {
    exerciseId: varchar('exercise_id', { length: 255 })
        .notNull()
        .references(() => ExercisesTable.id, { onDelete: 'cascade' }),
    classId: varchar('class_id', { length: 255 })
        .notNull()
        .references(() => ClassesTable.id, { onDelete: 'cascade' }),
    order: int('order').notNull(),
});

export const ExerciseClassesRelationships = relations(ExerciseClassesTable, ({ one }) => ({
    exercise: one(ExercisesTable, {
        fields: [ExerciseClassesTable.exerciseId],
        references: [ExercisesTable.id],
    }),
    class: one(ClassesTable, {
        fields: [ExerciseClassesTable.classId],
        references: [ClassesTable.id],
    }),
}));
