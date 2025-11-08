import { parseS3Url } from './storage';

// Test the S3 URL parsing
const testS3Url = 's3://chartix-new/uploads/obr16xibd1b7exgpgcr05br7/1760959098036-Sales_Report.xlsx';

console.log('Testing S3 URL parsing:');
console.log('Input:', testS3Url);
const parsed = parseS3Url(testS3Url);
console.log('Parsed result:', parsed);

if (parsed) {
    console.log('Bucket name:', parsed.bucketName);
    console.log('File key:', parsed.fileKey);
} else {
    console.log('Failed to parse S3 URL');
}

// Test with invalid URL
const invalidUrl = 'http://example.com/file.xlsx';
console.log('\nTesting invalid URL (not S3):');
console.log('Input:', invalidUrl);
const invalidParsed = parseS3Url(invalidUrl);
console.log('Parsed result:', invalidParsed);

console.log('\nNote: To test actual download functionality, the Supabase client needs to be configured correctly with proper credentials.');