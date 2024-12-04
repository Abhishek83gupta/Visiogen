"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import {
  IconWand,
  IconInfoCircle,
  IconAspectRatio,
  IconRobot,
  IconBrush,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { BiLoaderCircle } from "react-icons/bi";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be at least 7 characters!" }),
  model: z.string().nonempty("Please select a model."),
  aspectRatio: z.string().nonempty("Please select an aspect ratio."),
});

type FormValues = z.infer<typeof formSchema>;

const aspectRatioInfo = {
  "1:1": { name: "Square", desc: "Perfect for social media posts" },
  "16:9": { name: "Landscape", desc: "Ideal for desktop wallpapers" },
  "9:16": { name: "Portrait", desc: "Great for mobile wallpapers" },
  "21:9": { name: "Cinematic", desc: "Perfect for film-like scenes" },
  "9:21": { name: "Vertical", desc: "Ideal for stories and reels" },
  "2:1": { name: "Wide", desc: "Great for panoramic views" },
  "1:2": { name: "Tall", desc: "Perfect for vertical banners" },
};

const modelOptions = {
  "flux-pro": {
    name: "Flux Pro",
    desc: "Premium quality with enhanced details",
  },
  "flux.Schnell": {
    name: "Flux Schnell",
    desc: "Best overall quality and coherence",
  },
  flux: {
    name: "Flux",
    desc: "Fast and reliable generation",
  },
  turbo: {
    name: "Turbo",
    desc: "Quick generation with good quality",
  },
  mistral: {
    name: "Mistral",
    desc: "Artistic and creative outputs",
  },
};

export default function Page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRatio, setSelectedRatio] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: "",
      aspectRatio: "",
    },
  });

  const enhancePrompt = async () => {
    const currentPrompt = form.getValues("prompt");
    if (currentPrompt.length < 7) {
      toast({
        title: "Error",
        description: "Prompt must be at least 7 characters long to enhance.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEnhancing(true);
      const aiPrompt = `Act as an AI art prompt expert. Enhance this prompt by adding more details about style, lighting, mood, and composition, while maintaining the original idea: "${currentPrompt}". Make it more descriptive and artistic, but keep it concise.`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${encodeURIComponent(aiPrompt)}`
      );
      const enhancedText = await response.text();

      if (enhancedText && enhancedText.length > currentPrompt.length) {
        // Clean up the response by removing any potential AI conversation artifacts
        const cleanedText = enhancedText
          .replace(
            /^(As an AI art prompt expert,|Here's the enhanced prompt:|Enhanced version:|I would enhance it to:)/i,
            ""
          )
          .trim();

        form.setValue("prompt", cleanedText);
        toast({
          title: "Success",
          description: "Prompt has been enhanced with artistic details.",
          variant: "default",
        });
      } else {
        toast({
          title: "Notice",
          description: "No significant enhancement possible for this prompt.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        toast({
          variant: "default",
          description: "Image Generated Successfully",
        });
        setOutputImg(data.image);
      } else {
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4 pt-[72px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Image
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals using AI. Start by
            entering a detailed prompt, selecting your preferred model and
            aspect ratio.
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-8">
          <div className="lg:w-2/3 space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <IconWand className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Image Generator</h2>
              </div>
              <p className="text-zinc-400 text-sm">
                Be specific in your prompt for better results. Try including
                details about style, mood, and composition.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              placeholder="E.g., A serene landscape with mountains at sunset, digital art style"
                              className="h-12 lg:h-14 resize-none py-2 bg-zinc-800/50 pr-12" 
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-2 text-purple-400 hover:text-purple-300"
                              onClick={enhancePrompt}
                              disabled={isEnhancing || field.value.length < 7}
                              title="Enhance prompt by AI" // Tooltip on hover
                            >
                              {isEnhancing ? (
                                <BiLoaderCircle className="w-4 h-4 animate-spin" />
                              ) : (
                                <IconWand className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <IconRobot className="w-4 h-4 text-purple-400" />
                          <p className="text-sm text-zinc-400">AI Model</p>
                        </div>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedModel(value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose model" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(modelOptions).map(
                                ([key, model]) => (
                                  <SelectItem
                                    key={key}
                                    value={key}
                                    className="flex items-center justify-between group"
                                  >
                                    <div>
                                      <span className="font-medium">
                                        {model.name}
                                      </span>
                                      <span className="text-xs text-zinc-400 block">
                                        {model.desc}
                                      </span>
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <IconAspectRatio className="w-4 h-4 text-purple-400" />
                          <p className="text-sm text-zinc-400">Aspect Ratio</p>
                        </div>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedRatio(value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose ratio" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(aspectRatioInfo).map(
                                ([ratio, info]) => (
                                  <SelectItem
                                    key={ratio}
                                    value={ratio}
                                    className="flex items-center justify-between group"
                                  >
                                    <div>
                                      <span className="font-medium">
                                        {info.name}
                                      </span>
                                      <span className="text-xs text-zinc-400 block">
                                        {info.desc}
                                      </span>
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-zinc-400">
                    <IconBrush className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white mb-1">Prompt Tips</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Include art style (e.g., digital art, oil painting,
                          photography)
                        </li>
                        <li>
                          Specify lighting and mood (e.g., sunset, dramatic,
                          peaceful)
                        </li>
                        <li>
                          Add color preferences (e.g., vibrant, pastel,
                          monochrome)
                        </li>
                        <li>
                          Mention composition details (e.g., close-up, aerial
                          view)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6"
                >
                  {loading ? (
                    <p className="flex items-center gap-2">
                      Generate Image <BiLoaderCircle className="animate-spin" />
                    </p>
                  ) : (
                    "Generate Image"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 space-y-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div
                  className={`relative bg-zinc-800/50 rounded-lg overflow-hidden transition-all duration-300`}
                  style={{
                    aspectRatio: selectedRatio || "1/1",
                  }}
                >
                  {outputImg ? (
                    <Image
                      alt="Generated image"
                      src={outputImg}
                      fill
                      className="object-cover transition-opacity duration-300"
                      priority
                      quality={100}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm text-center p-4">
                      Your generated image will appear here
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-400">
                  <IconInfoCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Generated images will be optimized for the selected aspect
                    ratio. You can download them in full resolution after
                    generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
