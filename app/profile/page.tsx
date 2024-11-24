"use client";

import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BiLoaderCircle, BiDownload  } from "react-icons/bi";

export default function page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchposts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();

      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${prompt.slice(0, 20)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  useEffect(() => {
    fetchposts();
  }, []);

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <BiLoaderCircle className="animate-spin text-3xl md:text-3xl lg:text-5xl" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {posts.map((post,index) => {
            return (
              <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="w-full h-full p-2 border rounded-lg bg-card"
              key={post.id}
            >
              <div className="relative group">
                <Image
                  alt={post.prompt}
                  src={post.url}
                  width={250}
                  height={250}
                  className="w-full object-contain rounded-md"
                />
                <button
                  onClick={() => downloadImage(post.url, post.prompt)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Download image: ${post.prompt}`}
                >
                  <BiDownload className="text-white w-6 h-6" />
                </button>
              </div>
              <p className="text-card-foreground mt-2 text-sm line-clamp-2">{post.prompt}</p>
            </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
