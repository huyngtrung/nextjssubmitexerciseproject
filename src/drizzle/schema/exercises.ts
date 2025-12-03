import { float, mysqlTable, text, timestamp } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { ExerciseSubmissionsTable } from './exerciseSubmissions';
import { ExerciseClassesTable } from './exerciseClasses';

export const ExercisesTable = mysqlTable('exercises', {
    id,
    name: text('name').notNull(),
    description: text('description').notNull(),
    subject: text('subject').notNull(),
    dueDate: timestamp('due_date', { mode: 'date' }),
    maxScore: float('max_score'),
    s3Key: text('s3_key').notNull(),
    createdAt,
    updatedAt,
});

export const ExercisesRelationships = relations(ExercisesTable, ({ many }) => ({
    exerciseClasses: many(ExerciseClassesTable),
    exerciseSubmissions: many(ExerciseSubmissionsTable),
}));
