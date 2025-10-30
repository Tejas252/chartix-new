/**
 * Returns a Google Generative AI model instance.
 * @returns A configured GoogleGenerativeAI model instance.
 */
export function getGenerativeModel() {
  // Make sure to set the GOOGLE_API_KEY environment variable.
  // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
  // return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

return "openai/gpt-4o-mini";

}
