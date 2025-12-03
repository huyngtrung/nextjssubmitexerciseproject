import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        DB_PASSWORD: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_NAME: z.string().min(1),
        DB_HOST: z.string().min(1),
        DB_PORT: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1),
        CLERK_WEBHOOK_SECRET: z.string().min(1),
        AI_API_KEY: z.string().min(1),
        AWS_S3_REGION: z.string().min(1),
        AWS_S3_ACCESS_KEY_ID: z.string().min(1),
        AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
        TYPESENSE_API_KEY: z.string().min(1),
    },
    experimental__runtimeEnv: process.env,
});
