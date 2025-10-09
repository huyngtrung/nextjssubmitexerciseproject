import { varchar, timestamp } from 'drizzle-orm/mysql-core';
import { randomUUID } from 'crypto';

export const id = varchar('id', { length: 255 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID());

export const createdAt = timestamp('created_at').notNull().defaultNow();

export const updatedAt = timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
