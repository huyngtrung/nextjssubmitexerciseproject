import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/data/env/client';
import { s3Client } from '@/lib/s3Client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const key = body.key;

        if (!key || typeof key !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid object key.' }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
            Key: key,
        });

        // 15 phút = 900 giây
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

        return NextResponse.json({ url: signedUrl }, { status: 200 });
    } catch (error) {
        console.error('Failed to generate presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate URL.' }, { status: 500 });
    }
}
