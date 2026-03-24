import { authOptions } from "@/utils/authPrisma"; 
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"; 
import { v2 as cloudinary } from 'cloudinary'; 

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const aspectRatioOptions = [
  { id: "1:1" as const, width: 2048, height: 2008 },
  { id: "16:9" as const, width: 2048, height: 1240 },
  { id: "9:16" as const, width: 1280, height: 2008 },
  { id: "21:9" as const, width: 2048, height: 984 },
  { id: "9:21" as const, width: 1024, height: 2048 },
  { id: "2:1" as const, width: 2048, height: 1024 },
  { id: "1:2" as const, width: 1024, height: 2048 },
];

const allowedModels = [
  "flux",   
  "zimage",  
];

export async function POST(req: NextRequest) {
  try {
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

    const ratio = aspectRatioOptions.find((option) => option.id === aspectRatio);

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

    const randomSeed = Math.floor(Math.random() * 1000);
    const API = process.env.POLLINATIONS_API_URL; 
    const apiKey = process.env.POLLINATIONS_SECRET_KEY;
    const imageURL = `${API}${encodeURIComponent(
      prompt
    )}?seed=${randomSeed}&width=${ratio.width}&height=${ratio.height}&nologo=true&model=${model}&enhance=true`;

    // Fetch the image ourselves with the auth header
    const imageResponse = await fetch(imageURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Fail fast
    if (!imageResponse.ok) {
      console.error("Pollinations error:", imageResponse.status, await imageResponse.text());
      return NextResponse.json(
        { error: "Failed to generate image. Please try again." },
        { status: 500 }
      );
    }

    // Convert the response to a Buffer so Cloudinary never needs to
    // re-fetch the URL (which would fail without auth)
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Upload the buffer to Cloudinary via upload_stream
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ai-generated-images" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
          resolve(result as { secure_url: string });
        }
      );
      stream.end(imageBuffer);
    });

    // This is the permanent, secure URL for your image.
    const permanentImageUrl = uploadResult.secure_url;

    
    await prisma.post.create({
      data: {
        prompt,
        url: permanentImageUrl,
        seed: randomSeed,
        userId: user.id,
        model: model,
        aspectRatio: aspectRatio,
      },
    });

    return NextResponse.json({ message: "OK", image: permanentImageUrl });
  } catch (error) {
    console.error("Error in image generation API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}


export async function GET() {
  // Getting the user's session
  const session = await getServerSession(authOptions);

  if (!session) {
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
