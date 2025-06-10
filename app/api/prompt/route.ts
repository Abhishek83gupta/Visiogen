import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const aiPrompt = `Act as an AI art prompt expert. Enhance this prompt by adding more details about style, lighting, mood, and composition, while maintaining the original idea: "${prompt}". Make it more descriptive and artistic, but keep it concise.`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${encodeURIComponent(aiPrompt)}`
    );
    
    const enhancedText = await response.text();

    return NextResponse.json({ enhancedPrompt: enhancedText });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}