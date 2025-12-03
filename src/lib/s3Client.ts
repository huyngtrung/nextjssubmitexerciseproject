import 'server-only';
import { env as serverenv } from '@/data/env/server';

import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
    region: serverenv.AWS_S3_REGION,
    credentials: {
        accessKeyId: serverenv.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: serverenv.AWS_S3_SECRET_ACCESS_KEY,
    },
});
