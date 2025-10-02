import axios from "axios";
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

    // const aiPrompt = `Enhance this prompt in the ${style} art style: "${prompt}". Add details about lighting, mood, and composition. `;

    const aiPrompt = `Act as an AI art prompt expert specializing in ${style} style. Enhance this "${prompt}"
    Add vivid details for lighting, mood, and composition.
    Return only the enhanced prompt, no extra text or special characters.`;

    const response = await axios.get(
      `${process.env.TEXT_API_URL}/${encodeURIComponent(aiPrompt)}`
    );

    // If API fails
    if (!response) {
      return NextResponse.json(
        { error: "Failed to generate Text. Please try again." },
        { status: 500 }
      );
    }

    const enhancedText = await response.data;

    return NextResponse.json({ success: true, enhancedPrompt: enhancedText });
  } catch (error: any) {
    console.error("Error in prompt enhancement API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
