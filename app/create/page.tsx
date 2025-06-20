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
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  prompt: z
  .string()
  .min(7, { message: "Prompt must be at least 7 characters!" })
  .refine((value) => 
    !/\b(adult|explicit|nudity|sexual|porn|xxx|erotic|sex|18\+|naked|hot girl|hot guy|lingerie|intimate|provocative|hardcore|softcore|fetish|taboo|escort|camgirl|cam boy|stripper|onlyfans|bdsm|kinky|playboy|sensual|nude|vulgar|obscene|dirty|raunchy|lust|orgy|fornication|seduction|scantily clad|sultry|racy|provocative images|inappropriate|lewd|risque|unclothed|bare skin|suggestive|x-rated|adult toys|pornstar|graphic|sexy|sexcam|hookup|one night stand|swinger|affair|cheating|hentai|anime porn|yaoi|yuri|ecchi|nsfw|redtube|xhamster|youjizz|spicy content|shemale|trans porn|gay porn|lesbian porn|threesome|gangbang|milf|teen porn|amateur porn|voyeur|cam show|sex video|porn movie|dirty talk|roleplay|incest|stepmom|stepdad|stepsister|stepbrother|daddy|mommy|sister|brother|girlfriend|boyfriend|wife|husband|mature porn|young porn|barely legal|deepfake porn|virtual porn|vr porn|adult anime|asian porn|latina porn|black porn|ebony porn|white porn|arab porn|indian porn|euro porn|russian porn|cartoon porn|3d porn|sex toys|dildo|vibrator|buttplug|kama sutra|tantric sex|naughty|wild|lustful|pornhub|xvideos|xnxx|spankbang|erome|chaturbate|cam4|myfreecams|streamate|livejasmin|adultfriendfinder|ashleymadison|sugardaddy|sugarmommy|sugardating|escort service|massage parlor|adult classifieds|personal ads|kinky videos|smut|nudist|peeping|adult film|provocative ads|sexual acts|seductive|voyeuristic|undressed|explicit material|s*x|pornographic|striptease|burlesque|cam model|sultry looks|provocative outfits|lingerie shoot|glamour modeling|fetish videos|taboo topics|naughty chat|roleplay scenarios|adult scenes|unethical videos|inappropriate searches|graphic scenes|objectionable content|unlawful material|adult dating|sugar relationships|sexually suggestive|adult themes|explicit content|taboo searches|mature content|inappropriate requests|s*xual images|provocative queries|graphic content|sensual searches|inappropriate phrases|offensive searches|suggestive language|offensive material|provocative terms|s*xually explicit|censored|restricted|prohibited content|uncensored|indecent|sexual desire|romantic chat|hotline|seductive text|provocative messaging|vulgar jokes|inappropriate memes|adult games|adult entertainment|naughty stories|romantic fantasies|kissing scenes|explicit romance|love making|passionate content|lustful stories|dirty games|inappropriate links|adult cartoons|animated erotica|provocative audio|sensual music|romantic novels|explicit books|dirty blogs|hot clips|love chat|flirty messages|bedroom scenes|erotic dance|pole dance|adult-oriented|sexting|private chat|erotic videos|hidden camera|spicy novels|steamy content|lewd humor|explicit jokes|offensive pictures|sexual innuendo|inappropriate humor|erotic poems|steamy conversations|love stories|adult series|intimate details|romantic scenarios|hot magazines|provocative covers|scandalous content|shocking material|indecent exposure|racy photos|exotic content|flirtatious images|bold pictures|romantic encounters|intimate photos|love fantasies|private photos|adult fantasies|flirty photos|sensual texts|steamy videos|unethical searches|graphic images|offensive texts|romantic desires|inappropriate comics|provocative expressions|intimate videos|shocking images|indecent material|flirty stories|suggestive memes)\b/i.test(value), {
    message: "Prompt contains restricted content!",
  }),
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
    
    const response = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: currentPrompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to enhance prompt");
    }

    if (data.enhancedPrompt && data.enhancedPrompt.length > currentPrompt.length) {
      // Clean up the response by removing any potential AI conversation artifacts
      const cleanedText = data.enhancedPrompt
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
                              title="Enhance prompt by AI"
                            >
                              {isEnhancing ? (
                                <BiLoaderCircle className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
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