import { GoogleGenAI, GroundingChunk } from "@google/genai";
import type { Scholarship, NewsArticle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T>(text: string): T => {
    // The model may wrap the JSON in ```json ... ```, so we extract it.
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();
    
    if (!jsonString) {
        throw new Error("The model returned an empty response.");
    }
    
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("The model returned data in an unexpected format. Please try again.");
    }
};

interface ScholarshipFilters {
    major: string;
    academicLevel: string;
    location: string;
    gpa: string;
}

export const findScholarships = async (query: string, filters: ScholarshipFilters): Promise<{ scholarships: Scholarship[]; sources: GroundingChunk[] }> => {
  try {
    let prompt = `You are an expert scholarship database. Find the top 5 most relevant and currently active scholarships for a student interested in "${query}".`;

    if (filters.major) prompt += ` Their major is "${filters.major}".`;
    if (filters.academicLevel && filters.academicLevel !== 'Any') prompt += ` They are at the "${filters.academicLevel}" academic level.`;
    if (filters.location) prompt += ` They are located in or looking for scholarships in "${filters.location}".`;
    if (filters.gpa) prompt += ` Their GPA is ${filters.gpa}.`;

    prompt += `\n\nProvide details including the scholarship name, the provider, a brief description, the application deadline, and a direct link to the scholarship page. Ensure the information is up-to-date and verified.
    
You MUST return your findings as a valid JSON array of objects. Each object should have these keys: "name", "provider", "description", "deadline", "link".
Do not include any other text, markdown formatting, or explanations outside of the JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const scholarships = parseJsonResponse<Scholarship[]>(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { scholarships, sources };
  } catch (error) {
    console.error("Error finding scholarships:", error);
     if (error instanceof Error && error.message.includes("unexpected format")) {
        throw error;
    }
    throw new Error("Failed to fetch scholarships. Please check your query and filters, then try again.");
  }
};


export const getLatestNews = async (): Promise<{ articles: NewsArticle[]; sources: GroundingChunk[] }> => {
    try {
        const prompt = `Act as a news aggregator for students. Find the 5 most important and recent news articles related to higher education, scholarships, student life, and career opportunities for university students.
        
You MUST return your findings as a valid JSON array of objects. Each object should have these keys: "title", "summary", "source", "publishedDate", and "link".
Do not include any other text, markdown formatting, or explanations outside of the JSON array.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const articles = parseJsonResponse<NewsArticle[]>(response.text);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { articles, sources };
    } catch (error) {
        console.error("Error fetching news:", error);
        if (error instanceof Error && error.message.includes("unexpected format")) {
            throw error;
        }
        throw new Error("Failed to fetch the latest news. Please try again later.");
    }
};