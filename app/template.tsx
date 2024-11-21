"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const auth = usePathname();

  return <motion.div
  key={auth}
  initial={{ scale:0.9, opacity:0, filter:"blur(10px)" }}
  animate={{ scale:1, opacity:1, filter:"blur(0px)" }}
  >{children}</motion.div>;
}
