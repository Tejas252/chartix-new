import * as xlsx from 'xlsx';

/**
 * Extracts data from a file buffer (XLSX or CSV)
 * @param fileBuffer - The file buffer to read from
 * @returns A 2D array representing the worksheet data
 */
export function extractDataFromFileBuffer(fileBuffer: ArrayBuffer): any[][] {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet, { header: 1 });
}

/**
 * Extracts the first 5 rows of data from a 2D array, including the header
 * @param data - 2D array of worksheet data
 * @returns A string representation of the first 5 rows of data
 */
export function getFirstFiveRowsAsString(data: any[][]): string {
  if (!data || data.length === 0) return '';
  
  const header = data[0];
  const firstFiveRows = data.slice(1, 6);
  
  return [header, ...firstFiveRows]
    .map(row => row.join(', '))
    .join('\n');
}

/**
 * Parses and logs data in JSON format
 * @param data - The data to parse and log
 * @returns The parsed JSON object
 */
export function parseAndLogJSON<T = any>(data: any): T {
  try {
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    console.log('Parsed JSON:', JSON.stringify(jsonData, null, 2));
    return jsonData;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse JSON data');
  }
}
