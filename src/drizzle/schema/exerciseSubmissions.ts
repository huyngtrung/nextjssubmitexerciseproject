import { json, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';
import { ExercisesTable } from './exercises';
import { SubmissionFilesTable } from './submissionFiles';

export const ExerciseSubmissionsTable = mysqlTable('exercise_submissions', {
    id,
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => UserTable.id, { onDelete: 'cascade' }),
    exerciseId: varchar('exercise_id', { length: 255 })
        .notNull()
        .references(() => ExercisesTable.id, { onDelete: 'cascade' }),
    aiResultJson: json('ai_result_json'),
    createdAt,
    updatedAt,
});

export const ExerciseSubmissionsRelationships = relations(
    ExerciseSubmissionsTable,
    ({ one, many }) => ({
        user: one(UserTable, {
            fields: [ExerciseSubmissionsTable.userId],
            references: [UserTable.id],
        }),
        exercise: one(ExercisesTable, {
            fields: [ExerciseSubmissionsTable.exerciseId],
            references: [ExercisesTable.id],
        }),
        files: many(SubmissionFilesTable),
    }),
);
