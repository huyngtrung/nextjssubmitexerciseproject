import { env } from '@/data/env/server';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    // ssl: {
    //     rejectUnauthorized: false,
    // },
});

export const db = drizzle(connection, { schema, mode: 'default' });

// import { env } from "@/data/env/server"
// import { drizzle } from "drizzle-orm/node-postgres"
// import * as schema from "./schema"

// export const db = drizzle({
//   schema,
//   connection: {
//     password: env.DB_PASSWORD,
//     user: env.DB_USER,
//     database: env.DB_NAME,
//     host: env.DB_HOST,
//   },
// })
