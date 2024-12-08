"use client";

import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconMail,
  IconHeart,
} from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full bg-zinc-900/50 border-t border-zinc-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              Visio<span className="text-purple-400">gen AI</span>
            </h3>
            <p className="text-sm text-zinc-400">
              Transform your ideas into stunning visuals with AI-powered image
              generation
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Button
                  variant="link"
                  onClick={() => router.push("/create")}
                  className="p-0 h-auto text-zinc-400 hover:text-purple-400 transition-colors"
                >
                  Create Image
                </Button>
              </li>
              <li>
                <Link href="/#examples">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-zinc-400 hover:text-purple-400 transition-colors"
                  >
                    Examples
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-purple-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-purple-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              <Link
                href="https://github.com/Abhishek83gupta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                title="GitHub"
              >
                <IconBrandGithub className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/unkown_abhi_31?t=YRQjk3mS4urV2kJHJWm4cQ&s=08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                title="Twitter"
              >
                <IconBrandTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/abhishek-gupta-83a410295/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                title="LinkedIn"
              >
                <IconBrandLinkedin className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:abhishekgupta3104@gmail.com"
                className="text-zinc-400 hover:text-purple-400 transition-colors"
                title="Email"
              >
                <IconMail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-400">
          <p className="flex items-center justify-center gap-1">
            Made with <IconHeart className="w-4 h-4 text-red-400" /> by Abhishek
            Gupta
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Visiogen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
