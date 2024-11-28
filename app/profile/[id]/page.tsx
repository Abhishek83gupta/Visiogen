"use client";

import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BiDownload, BiLoaderCircle } from "react-icons/bi";
import { IconAspectRatio, IconRobot, IconSeeding } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ImageDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/image/${params.id}`);
      console.log(response);
      
      const data = await response.json();
      setPost(data.post);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const downloadImage = async () => {
    if (!post) return;
    try {
      const response = await fetch(post.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${post.prompt.slice(0, 20)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-[60px]">
        <BiLoaderCircle className="animate-spin text-4xl text-purple-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center pt-[60px] gap-4">
        <h1 className="text-2xl font-bold">Image not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen pt-[80px] px-4 pb-8"
    >
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 text-zinc-400 hover:text-white"
        >
          ← Back to Gallery
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="relative group">
            <Image
              src={post.url}
              alt={post.prompt}
              width={800}
              height={800}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50"
              priority
            />
            <Button
              onClick={downloadImage}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            >
              <BiDownload className="w-5 h-5 mr-2" />
              Download
            </Button>
          </div>

          {/* Image Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Image Details</h2>
              <div className="space-y-4">
              <div className="flex items-start gap-3">
                  <IconRobot className="w-5 h-5 mt-1 text-purple-400" />
                  <div>
                    <h3 className="font-medium">Model</h3>
                    <p className="text-zinc-400">{post.model}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IconSeeding className="w-5 h-5 mt-1 text-purple-400" />
                  <div>
                    <h3 className="font-medium">Seed</h3>
                    <p className="text-zinc-400">{post.seed || "Random"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IconAspectRatio className="w-5 h-5 mt-1 text-purple-400" />
                  <div>
                    <h3 className="font-medium">Aspect Ratio</h3>
                    <p className="text-zinc-400">{post.aspectRatio}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Prompt</h3>
              <p className="text-zinc-400 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                {post.prompt}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Created At</h3>
              <p className="text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}