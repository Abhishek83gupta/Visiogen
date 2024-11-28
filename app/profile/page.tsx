"use client";

import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiLoaderCircle, BiDownload } from "react-icons/bi";

export default function Page() {
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

  const router = useRouter();

  useEffect(() => {
    fetchposts();
  }, []);

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <BiLoaderCircle className="animate-spin text-3xl md:text-3xl lg:text-5xl text-purple-400" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {posts.map((post, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="w-full h-full p-2 border rounded-lg bg-card cursor-pointer hover:border-purple-400/50 transition-colors"
                key={post.id}
                onClick={() => router.push(`/profile/${post.id}`)}
              >
                <div className="relative group aspect-square">
                  <Image
                    alt={post.prompt}
                    src={post.url}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-md"
                  />
                </div>
                <p className="text-card-foreground mt-2 text-sm line-clamp-2">
                  {post.prompt}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
