import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt || !style) {
      return NextResponse.json(
        { error: "Prompt and style are required fields." },
        { status: 400 } 
      );
    }
    
    const aiPrompt = `Act as an AI art prompt expert specializing in ${style} style. 
    Enhance the following user prompt by adding vivid details about lighting, mood, and composition that fit the ${style} style, while maintaining the original idea. 
    Original idea: "${prompt}". 
    Important: Return ONLY the enhanced prompt text, without any conversational introduction like "Here is the enhanced prompt:".`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${encodeURIComponent(aiPrompt)}`
    );
    
    if (!response.ok) {
        throw new Error(`External API failed with status ${response.status}`);
    }

    const enhancedText = await response.text();

    return NextResponse.json({ success: true, enhancedPrompt: enhancedText });
  } catch (error) {
    console.error("Error in prompt enhancement API:", error);
    return NextResponse.json(
      { error: error},
      { status: 500 }
    );
  }
}