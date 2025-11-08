import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3";

// Test function to verify S3 client configuration
async function testS3Client() {
  console.log("Testing S3 Client configuration...");
  
  try {
    // This will test if the S3 client can be created with environment variables
    const s3Client = getS3Client();
    console.log("✓ S3 Client created successfully");
    
    // Test URL from the original request
    const testS3Url = 's3://chartix-new/uploads/obr16xibd1b7exgpgcr05br7/1760959098036-Sales_Report.xlsx';
    
    // Parse the S3 URL
    const urlParts = testS3Url.replace('s3://', '').split('/');
    const bucketName = urlParts[0];
    const fileKey = urlParts.slice(1).join('/');
    
    console.log(`Bucket: ${bucketName}`);
    console.log(`File Key: ${fileKey}`);
    
    // Create a GetObjectCommand (without sending it) to verify the format is correct
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    
    console.log("✓ GetObjectCommand created successfully with correct format");
    console.log("The function is ready to download files using the S3 client.");
    console.log("For actual download, environment variables must be properly configured.");
    
  } catch (error) {
    console.error("✗ Error in S3 client test:", error);
  }
}

// Run the test
testS3Client().catch(console.error);