import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { ExerciseSubmissionsTable } from './exerciseSubmissions';
import { relations } from 'drizzle-orm';

export const AIResultsTable = mysqlTable('ai_results', {
    id,
    exerciseSubmissionId: varchar('exercise_submission_id', { length: 255 })
        .notNull()
        .references(() => ExerciseSubmissionsTable.id, { onDelete: 'cascade' }),
    score: text('score').notNull(),
    feedback: text('feedback').notNull(),
    analysisSummary: text('analysis_summary').notNull(),
    createdAt,
    updatedAt,
});

export const AIResultsRelationships = relations(AIResultsTable, ({ one }) => ({
    exerciseSubmission: one(ExerciseSubmissionsTable, {
        fields: [AIResultsTable.exerciseSubmissionId],
        references: [ExerciseSubmissionsTable.id],
    }),
}));
