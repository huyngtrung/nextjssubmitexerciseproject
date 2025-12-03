import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/data/env/client';
import { s3Client } from '@/lib/s3Client';

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const key = body.key;

        if (!key || typeof key !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid object key.' }, { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);

        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete S3 object:', error);
        return NextResponse.json({ error: 'Failed to delete file.' }, { status: 500 });
    }
}
