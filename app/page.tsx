"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import {
  IconAspectRatio,
  IconRocket,
  IconLayout,
  IconHeart,
  IconWand,
  IconPhoto,
  IconArrowRight,
  IconQuote,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-20 bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-pink-500/20 to-transparent blur-3xl animate-pulse delay-150" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-4 sm:mx-auto text-center relative z-10"
      >
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl"
          style={{ pointerEvents: "none" }}
        />
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 relative">
            Visio<span className="text-purple-400">gen AI</span>
          </h1>
        </motion.div>
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-8 max-w-xl sm:max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with our AI-powered image
          generation platform
          <span className="text-purple-400"> completely free</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create">
            <Button className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
              Start creating <IconArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/#examples">
            <Button
              variant="outline"
              className="w-auto sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg border-zinc-700 hover:bg-zinc-800 text-white flex items-center justify-center"
            >
              View examples
            </Button>
            </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mt-32 relative"
      >
        <FeatureCard
          icon={<IconWand className="w-6 h-6 text-purple-400" />}
          title="AI-Powered Magic"
          description="State-of-the-art AI models to bring your imagination to life"
        />
        <FeatureCard
          icon={<IconAspectRatio className="w-6 h-6 text-purple-400" />}
          title="Multiple Aspect Ratios"
          description="Choose from various aspect ratios for perfect composition"
        />
        <FeatureCard
          icon={<IconPhoto className="w-6 h-6 text-purple-400" />}
          title="High Quality Output"
          description="Generate high-resolution images perfect for your projects"
        />
        <FeatureCard
          icon={<IconRocket className="w-6 h-6 text-purple-400" />}
          title="Fast Generation"
          description="Get your AI-generated images in seconds"
        />
        <FeatureCard
          icon={<IconLayout className="w-6 h-6 text-purple-400" />}
          title="Simple Interface"
          description="Easy-to-use interface for everyone"
        />
        <FeatureCard
          icon={<IconHeart className="w-6 h-6 text-purple-400" />}
          title="Free to Use"
          description="Create amazing images without any cost"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mt-32 text-center relative"
      >
        <h2 className="text-4xl font-bold mb-4 text-white">How It Works</h2>
        <p className="text-zinc-400 mb-12 max-w-2xl mx-auto">
          Generate amazing images in three simple steps
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          <StepCard
            step="1"
            title="Enter Prompt"
            description="Describe what you want to create in detail"
          />
          <StepCard
            step="2"
            title="Choose Settings"
            description="Select aspect ratio and other options"
          />
          <StepCard
            step="3"
            title="Generate"
            description="Let AI bring your vision to life"
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-32 text-center relative w-full max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto"
        id="examples"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          Stunning Examples
        </h2>
        <p className="text-zinc-400 mb-12 max-w-xl sm:max-w-2xl mx-auto">
          See what's possible with Visiogen AI
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <ExampleImage src="/img1.png" alt="Example 1" />
          <ExampleImage src="/img2.png" alt="Example 2" />
          <ExampleImage src="/img3.png" alt="Example 3" />
          <ExampleImage src="/img4.png" alt="Example 4" />
          <ExampleImage src="/img5.png" alt="Example 5" />
          <ExampleImage src="/img6.png" alt="Example 6" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-32 text-center relative w-full max-w-6xl overflow-hidden"
      >
        <h2 className="text-4xl font-bold mb-4 text-white">
          What Our Users Say
        </h2>
        <p className="text-zinc-400 mb-12 max-w-2xl mx-auto">
          Hear from creators who have transformed their ideas into stunning
          visuals
        </p>
        <TestimonialSlider />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="mt-16 sm:mt-24 text-center relative bg-gradient-to-b from-purple-500/10 to-transparent p-6 sm:p-10 md:p-12 rounded-2xl w-full max-w-3xl sm:max-w-4xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          Ready to Create?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 mb-6 sm:mb-8">
          Join thousands of creators making amazing images with Visiogen AI
        </p>
        <Link href="/create">
          <Button className="px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg bg-white text-black hover:bg-white/90 transition-all duration-300">
            Start generating for free
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors group backdrop-blur-sm"
    >
      <div className="mb-4 p-3 bg-purple-500/10 w-fit rounded-lg group-hover:bg-purple-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </motion.div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors relative backdrop-blur-sm"
    >
      <div className="absolute -top-4 left-6 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
        {step}
      </div>
      <h3 className="font-bold mb-2 text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </motion.div>
  );
}

function ExampleImage({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative aspect-square rounded-lg overflow-hidden transition-transform duration-300"
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </motion.div>
  );
}

function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      quote:
        "Visiogen AI has revolutionized my creative process. The quality of images it generates is mind-blowing!",
      author: "Sarah K.",
      role: "Graphic Designer",
    },
    {
      quote:
        "As a content creator, Visiogen AI has become an indispensable tool in my arsenal. It's fast, intuitive, and the results are amazing.",
      author: "Michael R.",
      role: "Content Creator",
    },
    {
      quote:
        "I never thought AI could capture my vision so accurately. Visiogen AI has exceeded all my expectations!",
      author: "Emily L.",
      role: "Art Director",
    },
    {
      quote:
        "Visiogen AI has unlocked a new level of creativity for me. I can bring my ideas to life effortlessly and with stunning detail.",
      author: "James P.",
      role: "Freelance Illustrator",
    },
    {
      quote:
        "The ease of use and the quality of the results make Visiogen AI a game-changer for professionals and hobbyists alike.",
      author: "Anna W.",
      role: "Digital Marketer",
    },
    {
      quote:
        "Visiogen AI delivers every time! It's like having a team of artists working for me. Highly recommended.",
      author: "David S.",
      role: "Entrepreneur",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: "100%", filter: "blur(4px)" }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            x: index === currentIndex ? 0 : "-100%",
            filter: index === currentIndex ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <TestimonialCard
            quote={testimonial.quote}
            author={testimonial.author}
            role={testimonial.role}
          />
        </motion.div>
      ))}
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm text-left h-full flex flex-col justify-between">
      <div>
        <IconQuote className="w-8 h-8 text-purple-400 mb-4" />
        <p className="text-white mb-4">{quote}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
          {author[0]}
        </div>
        <div>
          <p className="font-bold text-white">{author}</p>
          <p className="text-zinc-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}