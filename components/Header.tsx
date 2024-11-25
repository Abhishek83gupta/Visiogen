"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";
import LogoIcon from "./logo";

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
    <div className="fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center z-50">
      <Link href="/" className="flex gap-3">
        <LogoIcon />
        <h2 className="font-bold text-xl">Visiogen</h2>
      </Link>

      {initialLoading && status === "loading" ? (
        <BiLoaderCircle className="animate-spin" />
      ) : !session ? (
        <div className="menu">
          <Button className="hover:cursor-pointer" onClick={() => signIn()}>
            Login
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 justify-center items-center">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>

          <Link href="/profile">
            <Avatar>
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
    </div>
  );
}
