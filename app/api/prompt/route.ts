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

    const aiPrompt = `Act as an AI art prompt expert specializing in ${style} style. Enhance this: "${prompt}". Add vivid details for lighting, mood, and composition. Return only the enhanced prompt, no extra text or special characters.`;

    const response = await fetch(`${process.env.TEXT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POLLINATIONS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "user", content: aiPrompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pollinations text error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate enhanced prompt. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const enhancedText = data?.choices?.[0]?.message?.content ?? "";

    if (!enhancedText) {
      return NextResponse.json(
        { error: "No enhanced prompt returned from API." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enhancedPrompt: enhancedText });
  } catch (error: any) {
    console.error("Error in prompt enhancement API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
