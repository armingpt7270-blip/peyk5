
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateChatResponse = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return "سرویس هوشمند در حال حاضر در دسترس نیست. لطفا API Key را تنظیم کنید.";
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: `شما یک دستیار هوشمند و مودب برای یک سامانه مدیریت پیک موتوری ایرانی هستید. لطفا به زبان فارسی، کوتاه و مفید پاسخ دهید. کاربر میپرسد: "${prompt}"` }] }],
        });

        if (response && response.text) {
            return response.text;
        } else {
             return "متاسفم، نتوانستم پاسخی تولید کنم.";
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'خطایی در ارتباط با هوش مصنوعی رخ داد.';
    }
};
