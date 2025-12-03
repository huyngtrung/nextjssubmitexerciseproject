import { Client } from 'typesense';
import { env } from '@/data/env/server';

export const typesenseClient = new Client({
    nodes: [
        {
            host: 'localhost',
            port: 8108,
            protocol: 'http',
        },
    ],
    apiKey: env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 2,
});
