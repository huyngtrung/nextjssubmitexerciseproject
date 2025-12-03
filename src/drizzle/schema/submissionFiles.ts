import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { ExerciseSubmissionsTable } from './exerciseSubmissions';
import { relations } from 'drizzle-orm';

export const SubmissionFilesTable = mysqlTable('submission_files', {
    id,
    exerciseSubmissionId: varchar('ex_submission_id', { length: 255 })
        .notNull()
        .references(() => ExerciseSubmissionsTable.id, { onDelete: 'cascade' }),
    s3Key: text('s3_key').notNull(),
    fileType: varchar('file_type', { length: 255 }).notNull(),
    createdAt,
    updatedAt,
});

export const SubmissionFilesRelationships = relations(SubmissionFilesTable, ({ one }) => ({
    exerciseSubmission: one(ExerciseSubmissionsTable, {
        fields: [SubmissionFilesTable.exerciseSubmissionId],
        references: [ExerciseSubmissionsTable.id],
    }),
}));
