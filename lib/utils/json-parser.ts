export function markDownToJson(text: string) {
    try {
      // Match first JSON block (inside ```json ... ```)
      const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
      if (match) {
        return JSON.parse(match[1]);
      }
  
      // If no fenced code block, try to find first { ... }
      const curlyMatch = text.match(/\{[\s\S]*\}/);
      if (curlyMatch) {
        return JSON.parse(curlyMatch[0]);
      }
  
      return null;
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return null;
    }
  }