import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json(); // body data

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000);
  }

  const randomSeed = generateRandomNumber();
  const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&nologo=True`;

  await fetch(imageURL)

  return NextResponse.json({ message: "OK", image : imageURL });
}
