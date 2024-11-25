import { authOptions } from "@/utils/authPrisma";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // getting session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Your are Unauthorized" },
      { status: 401 }
    );
  }

  // body data
  const { prompt } = await request.json();

  // getting user
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }
  // generating random number
  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000);
  }
  const randomSeed = generateRandomNumber();

  // generating image
  const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&nologo=True`;
  await fetch(imageURL);

  // creating post fields
  await prisma.post.create({
    data: {
      prompt: prompt,
      url: imageURL,
      seed: randomSeed,
      userId: user.id,
    },
  });

  return NextResponse.json({ message: "OK", image: imageURL });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Your are Unauthorized" },
      { status: 401 }
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

  const posts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    }
  })

  return NextResponse.json({ success: true, posts : posts});
}