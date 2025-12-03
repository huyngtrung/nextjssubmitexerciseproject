import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { env } from '@/data/env/client';
import { s3Client } from '@/lib/s3Client';

const uploeadRequestSchema = z.object({
    filename: z.string(),
    contentType: z.string(),
    size: z.number(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = uploeadRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { filename, contentType, size } = validation.data;

        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

        const uniqueKey = `exercises/${timestamp}_${uuidv4()}_${filename}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
            Key: uniqueKey,
            ContentType: contentType,
            ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 360, // URL expires in 6 minutes
        });

        const response = {
            presignedUrl,
            key: uniqueKey,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }
}

// import { NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { env as serverenv } from '@/data/env/server';
// import { env } from '@/data/env/client';

// const s3Client = new S3Client({
//     region: serverenv.AWS_S3_REGION,
//     credentials: {
//         accessKeyId: serverenv.AWS_S3_ACCESS_KEY_ID,
//         secretAccessKey: serverenv.AWS_S3_SECRET_ACCESS_KEY,
//     },
// });

// async function uploadFileToS3(file: string, fileName: string) {
//     const fileBuffer = file;

//     const params = {
//         Bucket: env.NEXT_PUBLIC_AMS_S3_BUCKET_NAME,
//         Key: `myfolder${file}-${Date.now()}`,
//         body: fileBuffer,
//         contentType: 'image/jpg',
//     };

//     const command = new PutObjectCommand(params);
//     await s3Client.send(command);
//     return fileName;
// }

// export async function POST(request: Request) {
//     try {
//         const formData = await request.formData();
//         const file = formData.get('file');

//         if (!file) {
//             return NextResponse.json({ mssg: 'error file not found' }, { status: 400 });
//         }

//         const buffer = Buffer.from(await file.arrayBuffer());
//         const fileName = await uploadFileToS3(buffer, file.name);

//         return NextResponse.json({ msg: 'Successfully uploading file' }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: 'Error uploading file' });
//     }
// }
