import { authOptions } from "@/utils/authPrisma"; 
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"; 


export async function POST(request: NextRequest) {
  // Getting the user's session
  const session = await getServerSession(authOptions);
  if (!session) {
    // If no session is found, return an unauthorized response
    return NextResponse.json(
      { error: "You are Unauthorized" },
      { status: 401 }
    );
  }

  // Parse the request body to get the prompt
  const { prompt } = await request.json();

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

  // Function to generate a random number to use as a seed
  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000);
  }
  const randomSeed = generateRandomNumber();

  // Generate the image URL using the prompt and random seed
  const imageURL = `${process.env.API_URL}${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&width=512&height=512&nologo=True`;
  await fetch(imageURL); // Fetch the generated image (ensure it exists)

  // Create a new post entry in the database
  await prisma.post.create({
    data: {
      prompt: prompt,
      url: imageURL,
      seed: randomSeed, 
      userId: user.id, 
    },
  });

  // Return a success response with the image URL
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