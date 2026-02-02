import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export const runtime = "edge"; // Optional: Use edge runtime for faster response if supported

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        // Fetch the image data
        const imageResp = await fetch(imageUrl);
        if (!imageResp.ok) {
            return NextResponse.json({ error: "Failed to fetch image" }, { status: 400 });
        }

        const imageBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        // Initialize Gemini Model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this meme/image. 
        1. Generate a funny, relatable, and short caption for it (max 20 words).
        2. Generate 5 relevant hashtags (without the # symbol, just space separated words).
        
        Return the response in this exact JSON format:
        {
            "caption": "Your generated caption here",
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg", // Assuming jpeg for simplicity, or detect mime type
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse JSON from text (handle potential markdown code blocks)
        let jsonStr = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}
