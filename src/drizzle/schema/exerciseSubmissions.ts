import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id } from '../schemaHelpers';
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
    fileUrl: text('file_url').notNull(),
    finalScore: varchar('final_score', { length: 255 }).notNull(),
    aiFeedBack: text('ai_feedback_summary').notNull(),
    createdAt,
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
