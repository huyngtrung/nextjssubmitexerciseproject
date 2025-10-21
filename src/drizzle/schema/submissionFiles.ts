import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id } from '../schemaHelpers';
import { ExerciseSubmissionsTable } from './exerciseSubmissions';
import { relations } from 'drizzle-orm';

export const SubmissionFilesTable = mysqlTable('submission_files', {
    id,
    exerciseSubmissionId: varchar('ex_submission_id', { length: 255 })
        .notNull()
        .references(() => ExerciseSubmissionsTable.id, { onDelete: 'cascade' }),
    fileUrl: text('file_url').notNull(),
    fileType: varchar('file_type', { length: 255 }).notNull(),
    ocrText: text('ocr_text').notNull(),
    createdAt,
});

export const SubmissionFilesRelationships = relations(SubmissionFilesTable, ({ one }) => ({
    exerciseSubmission: one(ExerciseSubmissionsTable, {
        fields: [SubmissionFilesTable.exerciseSubmissionId],
        references: [ExerciseSubmissionsTable.id],
    }),
}));
