import { GoogleGenAI } from '@google/genai';

export interface AIAnalysisResult {
  productName: string;
  brand: string;
  category: string;
  quantity: number;
  unit: string;
  manufacturingDate: string | null;
  expiryDate: string | null;
  batchNumber: string | null;
  storageRequirement: string;
  packagingCondition: string;
  visualIndicators: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: {
    product: number;
    expiry: number;
    packaging: number;
  };
  warnings: string[];
  recommendation: string;
}

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    // Requires GEMINI_API_KEY in .env
    this.ai = new GoogleGenAI();
  }

  async analyzeFoodImage(base64Image: string): Promise<AIAnalysisResult> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing.");
      }

      // Extract the mime type from the base64 string, default to jpeg if not found
      const match = base64Image.match(/^data:(.*?);base64,/);
      const mimeType = match ? match[1] : 'image/jpeg';
      
      // Remove the prefix completely
      const cleanBase64 = base64Image.replace(/^data:.*?;base64,/, "");

      const prompt = `
        You are an elite, highly-trained Food Safety and Quality Assurance AI.
        Analyze this image of a food product or packaging. Your job is to extract highly accurate data, 
        identify any potential safety risks, and provide actionable recommendations.
        
        Rules for extraction:
        1. Read ALL text carefully (OCR). Look for hidden expiry dates, best before dates, and manufacturing dates.
        2. If the item has NO label or text (e.g., loose produce like carrots, apples), you MUST visually identify it and provide a descriptive name (e.g., "Fresh Carrots"). DO NOT output "Unknown".
        3. If an expiry date is NOT printed (or there is no label), you MUST estimate its shelf life based on the visual identity (e.g., fresh bread = 5 days, apples = 14 days, carrots = 21 days). Calculate and output the exact estimated "YYYY-MM-DD" date assuming today is ${new Date().toISOString().split('T')[0]}. DO NOT output null for expiryDate unless it's a completely non-perishable non-food item.
        4. Scrutinize the packaging or the item itself for micro-tears, swelling, mold, discoloration, or bruising.
        5. Assess the risk level strictly: HIGH/CRITICAL if damaged or expired, MEDIUM if expiring soon (within 3 days), LOW if fresh and intact.
        6. Return ONLY a raw JSON object matching the exact structure below. DO NOT include markdown formatting (\`\`\`json).

        Required JSON structure:
        {
          "productName": "Detailed descriptive name (e.g., Organic Gala Apples, Amul Toned Milk)",
          "brand": "Brand name if visible, else 'Unknown'",
          "category": "e.g., Dairy, Produce, Bakery, Meat, Pantry",
          "quantity": number (exact if written, otherwise estimate visual count or weight),
          "unit": "e.g., kg, L, units, pieces, g, ml",
          "manufacturingDate": "YYYY-MM-DD" or null if absolutely not found,
          "expiryDate": "YYYY-MM-DD",
          "batchNumber": "Batch/Lot number if visible, else null",
          "storageRequirement": "Highly specific storage instructions (e.g., Keep refrigerated below 4°C)",
          "packagingCondition": "Detailed visual condition (e.g., Intact, Swollen, Bruised, Torn seal)",
          "visualIndicators": ["Array of observed visual signs, e.g., 'Signs of oxidation', 'Firm texture', 'Swollen lid']",
          "riskLevel": "LOW", "MEDIUM", "HIGH", or "CRITICAL",
          "confidence": { "product": 0.0-1.0, "expiry": 0.0-1.0, "packaging": 0.0-1.0 },
          "warnings": ["Array of critical safety warnings if any risks are detected"],
          "recommendation": "Expert advice on immediate actions the staff should take (e.g., 'Use within 2 days', 'Discard immediately due to mold')"
        }
      `;

      console.log("Calling Gemini API with model: gemini-3.7-flash and mimeType:", mimeType);
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          }
        ]
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");

      // Clean the response (sometimes it includes conversational text)
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Could not find JSON object in AI response");
      }
      
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      const result: AIAnalysisResult = JSON.parse(jsonString);
      return result;

    } catch (error) {
      console.error("AI Analysis failed. Falling back to mock data.", error);
      // Fallback if API fails or key is missing
      return {
        productName: "Unknown Product (AI Failed)",
        brand: "Unknown",
        category: "Other",
        quantity: 1,
        unit: "units",
        manufacturingDate: null,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        batchNumber: null,
        storageRequirement: "Dry Storage",
        packagingCondition: "Unknown",
        visualIndicators: [],
        riskLevel: "MEDIUM",
        confidence: { product: 0, expiry: 0, packaging: 0 },
        warnings: ["AI analysis failed. Please enter data manually."],
        recommendation: "Manual inspection required."
      };
    }
  }
}

export const aiService = new AIService();
