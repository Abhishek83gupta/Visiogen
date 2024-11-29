import { authOptions } from "@/utils/authPrisma"; 
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"; 

type AspectRatioKey = "1:1" | "16:9" | "9:16" | "21:9" | "9:21" | "2:1" | "1:2";

const aspectRatios: Record<AspectRatioKey, { width: number; height: number }> = {
  "1:1": { width: 2048, height: 2008 },
  "16:9": { width: 2048, height: 1240 },
  "9:16": { width: 1280, height: 2008 },
  "21:9": { width: 2048, height: 984 },
  "9:21": { width: 1024, height: 2048 },
  "2:1": { width: 2048, height: 1024 },
  "1:2": { width: 1024, height: 2048 },
};

const allowedModels = [
  "flux.Schnell",
  "flux",
  // "flux-realism",
  // "flux-cablyai",
  // "flux-anime",
  // "flux-3d",
  // "any-dark",
  "flux-pro",
  "turbo",
  "mistral"
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
  }

  const { prompt, model, aspectRatio } = await req.json();

  if (!prompt || !model || !aspectRatio) {
    return NextResponse.json(
      { error: "Prompt, model, and aspect ratio are required." },
      { status: 400 }
    );
  }

  if (!allowedModels.includes(model)) {
    return NextResponse.json({ error: "Invalid model selected." }, { status: 400 });
  }

  const ratio = aspectRatios[aspectRatio as AspectRatioKey];
  if (!ratio) {
    return NextResponse.json(
      { error: "Invalid aspect ratio selected." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000);
  }
  const randomSeed = generateRandomNumber();

  const imageURL = `${process.env.API_URL}${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=${ratio.width}&height=${ratio.height}&nologo=true&model=${model}&enhance=true`;

  // Fetch the image to validate the request (optional)
  const imageResponse = await fetch(imageURL);
  if (!imageResponse.ok) {
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }

  // Store the generated image URL and metadata in the database
  await prisma.post.create({
    data: {
      prompt,
      url: imageURL,
      seed: randomSeed,
      userId: user.id,
      model : model,
      aspectRatio : aspectRatio
    },
  });

  return NextResponse.json({ message: "OK", image: imageURL });
}

export async function GET() {
  // Getting the user's session
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session is found, return an unauthorized response
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch the user from the database using the session user ID
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    // If the user is not found, return an error response
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  // Fetch all posts created by the user, ordered by creation date in descending order
  const posts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc", // Order posts by the latest first
    },
  });

  // Return a success response with the user's posts
  return NextResponse.json({ success: true, posts: posts });
}