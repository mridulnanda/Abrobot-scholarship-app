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
        // Remove markdown code blocks if present
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
    If the deadline is 'Rolling', 'Open', or unknown, explicitly use the string "Rolling".

    OUTPUT FORMAT:
    Return ONLY a raw JSON array. Do not output markdown code blocks.
    Each object in the array must have these exact keys:
    - "name": string
    - "provider": string
    - "description": string
    - "deadline": string
    - "link": string`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // NOTE: responseMimeType and responseSchema are NOT supported with googleSearch
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
        
        const prompt = `Today is ${today}. Act as a real-time news aggregator. 
        Perform a Google Search to find the 15-20 most significant and breaking news articles related to:
        - Higher education trends
        - Study abroad updates
        - International Student Visas
        - New Scholarship announcements
        
        Prioritize news published TODAY or within the last 48 hours.
        
        OUTPUT FORMAT:
        Return ONLY a raw JSON array. Do not output markdown code blocks.
        The JSON must be an array of objects with these keys:
        - "title": Headline of the article
        - "summary": A 2-sentence summary
        - "source": Name of the publisher
        - "publishedDate": The specific date or time ago (e.g., "2 hours ago", "Nov 14")
        - "link": The URL to the article`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                // NOTE: responseMimeType and responseSchema are NOT supported with googleSearch
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