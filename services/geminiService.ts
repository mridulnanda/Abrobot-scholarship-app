import { GoogleGenAI, GroundingChunk, Type } from "@google/genai";
import type { Scholarship, NewsArticle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ScholarshipFilters {
    major: string;
    academicLevel: string;
    location: string;
    gpa: string;
}

const cleanAndParseJSON = (text: string) => {
    try {
        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("JSON Parse failed on:", text);
        throw new Error("Received invalid data format from AI.");
    }
};

export const findScholarships = async (query: string, filters: ScholarshipFilters): Promise<{ scholarships: Scholarship[]; sources: GroundingChunk[] }> => {
  try {
    let prompt = `Find the top 15 most relevant and currently active scholarships for a student interested in "${query}".`;

    if (filters.major) prompt += ` Their major is "${filters.major}".`;
    if (filters.academicLevel && filters.academicLevel !== 'Any') prompt += ` They are at the "${filters.academicLevel}" academic level.`;
    if (filters.location) prompt += ` They are located in or looking for scholarships in "${filters.location}".`;
    if (filters.gpa) prompt += ` Their GPA is ${filters.gpa}. Only include scholarships that accept this GPA.`;

    prompt += `\n\nProvide details including the scholarship name, the provider, a brief description, the application deadline, and a direct link.
    
    CRITICAL INSTRUCTION FOR DEADLINE:
    The 'deadline' field MUST be in 'YYYY-MM-DD' format (e.g., 2024-12-31). 
    If the deadline is 'Rolling', 'Open', or unknown, explicitly use the string "Rolling".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    description: { type: Type.STRING },
                    deadline: { type: Type.STRING, description: "YYYY-MM-DD or 'Rolling'" },
                    link: { type: Type.STRING }
                },
                required: ["name", "provider", "description", "deadline", "link"]
            }
        }
      },
    });
    
    let scholarships: Scholarship[] = [];
    if (response.text) {
        try {
            scholarships = cleanAndParseJSON(response.text);
        } catch (e) {
            console.error("Failed to parse scholarship JSON", e);
        }
    }
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { scholarships, sources };
  } catch (error) {
    console.error("Error finding scholarships:", error);
    throw new Error("Failed to fetch scholarships. Please check your query and filters, then try again.");
  }
};


export const getLatestNews = async (): Promise<{ articles: NewsArticle[]; sources: GroundingChunk[] }> => {
    try {
        // Inject current date to force real-time context
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const prompt = `Today is ${today}. Act as a real-time news aggregator. Search for and find the 20 most significant and breaking news articles related to higher education, study abroad trends, scholarships, and student visa updates from the last 24 hours. 
        
        Prioritize news that is happening NOW. Return strict JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            source: { type: Type.STRING },
                            publishedDate: { type: Type.STRING },
                            link: { type: Type.STRING }
                        },
                        required: ["title", "summary", "source", "publishedDate", "link"]
                    }
                }
            },
        });

        let articles: NewsArticle[] = [];
        if (response.text) {
            try {
                articles = cleanAndParseJSON(response.text);
            } catch (e) {
                console.error("Failed to parse news JSON", e);
            }
        }

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { articles, sources };
    } catch (error) {
        console.error("Error fetching news:", error);
        throw new Error("Failed to fetch the latest news. Please check your connection or try again later.");
    }
};