import { mysqlEnum, mysqlTable, primaryKey, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, updatedAt } from '../schemaHelpers';
import { ExercisesTable } from './exercises';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';

export const exerciseSubmissionStatus = ['SUBMITTED_ON_TIME', 'SUBMITTED_LATE'] as const;
export type ExerciseSubmissionStatus = (typeof exerciseSubmissionStatus)[number];

export const ExerciseProgressTable = mysqlTable(
    'exercise_progress',
    {
        userId: varchar('user_id', { length: 255 })
            .notNull()
            .references(() => UserTable.id, { onDelete: 'cascade' }),
        exerciseId: varchar('exercise_id', { length: 255 })
            .notNull()
            .references(() => ExercisesTable.id, { onDelete: 'cascade' }),

        submissionStatus: mysqlEnum('role', exerciseSubmissionStatus)
            .notNull()
            .default('SUBMITTED_ON_TIME'),
        completedAt: timestamp('completed_at'),
        createdAt,
        updatedAt,
    },
    (table) => ({
        pk: primaryKey(table.userId, table.exerciseId),
    }),
);

export const ExerciseProgressRelationships = relations(ExerciseProgressTable, ({ one }) => ({
    user: one(UserTable, { fields: [ExerciseProgressTable.userId], references: [UserTable.id] }),
    exercise: one(ExercisesTable, {
        fields: [ExerciseProgressTable.exerciseId],
        references: [ExercisesTable.id],
    }),
}));
