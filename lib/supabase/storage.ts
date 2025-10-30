import { getS3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

/**
 * Downloads a file from external S3-compatible storage
 * @param filePath - The path to the file, either as an S3 URL or regular URL
 * @returns ArrayBuffer of the file content or null if failed
 */
export async function downloadFileFromStorage(filePath: string): Promise<ArrayBuffer | null> {
  try {
    // Extract bucket name and file path from the s3 URL format
    // Expected format: s3://bucket-name/path/to/file
    if (filePath.startsWith('s3://')) {
      // Parse the S3 URL to extract bucket and file path
      const urlParts = filePath.replace('s3://', '').split('/');
      const bucketName = urlParts[0];
      const fileKey = urlParts.slice(1).join('/');

      // Initialize S3 client
      const s3Client = getS3Client();

      // Create and send GetObjectCommand to retrieve the file
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      try {
        const response = await s3Client.send(command);
        const body = response.Body;
        
        // Convert the S3 body stream to ArrayBuffer
        if (body) {
          // Convert to buffer first then to ArrayBuffer
          const buffer = Buffer.from(await body.transformToByteArray());
          return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
        } else {
          console.error('No body returned from S3');
          return null;
        }
      } catch (s3Error) {
        console.error('Error downloading file from S3-compatible storage:', s3Error);
        return null;
      }
    } else {
      // For regular URLs, use fetch
      const response = await fetch(filePath);
      if (!response.ok) {
        console.error('Failed to fetch file:', response.statusText);
        return null;
      }
      return await response.arrayBuffer();
    }
  } catch (error) {
    console.error('Error in downloadFileFromStorage:', error);
    return null;
  }
}

/**
 * Extracts bucket name and file key from an S3 URL
 * @param s3Url - The S3 URL in format s3://bucket-name/path/to/file
 * @returns Object with bucketName and fileKey or null if invalid format
 */
export function parseS3Url(s3Url: string): { bucketName: string; fileKey: string } | null {
  if (!s3Url.startsWith('s3://')) {
    return null;
  }

  const urlParts = s3Url.replace('s3://', '').split('/');
  const bucketName = urlParts[0];
  const fileKey = urlParts.slice(1).join('/');

  if (!bucketName || !fileKey) {
    return null;
  }

  return { bucketName, fileKey };
}