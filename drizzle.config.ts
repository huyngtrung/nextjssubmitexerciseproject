// production
import { env } from '@/data/env/server';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    // Add your configuration here
    out: './src/drizzle/migrations',
    schema: './src/drizzle/schema.ts',
    dialect: 'mysql',
    strict: true,
    verbose: true,
    dbCredentials: {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
    },
});

//Dev
// import { env } from '@/data/env/server';
// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//     // Add your configuration here
//     out: './src/drizzle/migrations',
//     schema: './src/drizzle/schema.ts',
//     dialect: 'mysql',
//     strict: true,
//     verbose: true,
//     dbCredentials: {
//         password: env.DB_PASSWORD,
//         user: env.DB_USER,
//         database: env.DB_NAME,
//         host: env.DB_HOST,
//         port: 3306,
//         ssl: {
//             rejectUnauthorized: false,
//         },
//     },
// });
