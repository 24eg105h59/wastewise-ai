import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: "Hello"
    });
    console.log("Success:", response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}
test();
