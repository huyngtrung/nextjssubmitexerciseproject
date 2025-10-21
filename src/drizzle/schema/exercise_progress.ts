import { boolean, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createdAt } from '../schemaHelpers';
import { ExercisesTable } from './exercises';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';

export const ExerciseProgressTable = mysqlTable('exercise_progress', {
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => UserTable.id, { onDelete: 'cascade' }),
    exerciseId: varchar('exercise_id', { length: 255 })
        .notNull()
        .references(() => ExercisesTable.id, { onDelete: 'cascade' }),
    completed: boolean('completed').default(false),
    completedAt: timestamp('completed_at'),
    createdAt,
});

export const ExerciseProgressRelationships = relations(ExerciseProgressTable, ({ one }) => ({
    user: one(UserTable, { fields: [ExerciseProgressTable.userId], references: [UserTable.id] }),
    exercise: one(ExercisesTable, {
        fields: [ExerciseProgressTable.exerciseId],
        references: [ExercisesTable.id],
    }),
}));
