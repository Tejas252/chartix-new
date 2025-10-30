import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = () => {
    return new S3Client({
        region: process.env.SUPABASE_S3_REGION || "auto",
        endpoint: process.env.SUPABASE_S3_ENDPOINT, // Supabase S3-compatible endpoint
        forcePathStyle: true, // required for most S3-compatible services
        credentials: {
            accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY as string,
            secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY as string,
        },
    });
}