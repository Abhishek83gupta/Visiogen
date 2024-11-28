"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";
import LogoIcon from "./logo";
import { motion } from "framer-motion";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); 
  };

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full h-[60px] bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-4 flex justify-between items-center z-50"
    >
      <Link href="/" className="flex items-center gap-3">
        <LogoIcon className="w-8 h-8 text-purple-400" />
        <h2 className="font-bold text-xl">
          Visio<span className="text-purple-400">gen AI</span>
        </h2>
      </Link>

      <div className="flex items-center gap-4">
        {initialLoading && status === "loading" ? (
          <BiLoaderCircle className="animate-spin text-purple-400" />
        ) : !session ? (
          <Button 
            onClick={() => signIn()}
            className="bg-purple-500 hover:bg-purple-600 text-white transition-colors"
          >
            Login
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:text-red-400 transition-colors"
            >
              Logout
            </Button>

            <Link href="/profile">
              <Avatar className="border-2 border-purple-400/20 hover:border-purple-400/40 transition-colors">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="bg-purple-500/10 text-purple-400">
                  {session.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}