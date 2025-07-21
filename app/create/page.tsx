"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { IconWand, IconInfoCircle, IconAspectRatio, IconRobot, IconBrush, IconPalette } from "@tabler/icons-react";
import { BiLoaderCircle } from "react-icons/bi";
import { Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";

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
  style: z.string().nonempty("Please select a style."), // New field
});

type FormValues = z.infer<typeof formSchema>;

const aspectRatioOptions = [
  { id: "1:1", name: "Square", desc: "For social media posts" },
  { id: "16:9", name: "Landscape", desc: "For desktop wallpapers" },
  { id: "9:16", name: "Portrait", desc: "For mobile wallpapers" },
  { id: "21:9", name: "Cinematic", desc: "For film-like scenes" },
  { id: "9:21", name: "Vertical", desc: "For stories and reels" },
];

const modelOptions = [
  { id: "flux-pro", name: "Flux Pro", desc: "Premium quality, enhanced details" },
  { id: "flux.Schnell", name: "Flux Schnell", desc: "Best overall quality & coherence" },
  { id: "flux", name: "Flux", desc: "Fast and reliable generation" },
  { id: "turbo", name: "Turbo", desc: "Quick generation, good quality" },
  { id: "mistral", name: "Mistral", desc: "Artistic and creative outputs" },
];

const styleOptions = [
  { id: "realistic", name: "Realistic", desc: "Lifelike and photographic" },
  { id: "anime", name: "Anime", desc: "Japanese animation style" },
  { id: "cartoon", name: "Cartoon", desc: "Playful and stylized" },
  { id: "3d-render", name: "3D Render", desc: "Polished and computer-generated" },
  { id: "pixel-art", name: "Pixel Art", desc: "Retro and blocky" },
  { id: "ghibli-style", name: "Ghibli", desc: "Whimsical, hand-drawn look" },
  { id: "oil-painting", name: "Oil Painting", desc: "Classic and textured" },
  { id: "cyberpunk", name: "Cyberpunk", desc: "Futuristic and neon-lit" },
  { id: "portrait", name: "Portrait", desc: "Focus on face and character" },
];

export default function Page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const mounted = useMounted();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "", model: "", aspectRatio: "", style: "" },
  });

  const watchedRatio = form.watch("aspectRatio");

  const enhancePrompt = async () => {
    const currentPrompt = form.getValues("prompt");
    const currentStyle = form.getValues("style"); 

    if (!currentStyle) {
      toast({
        title: "Style Required",
        description: "Please select an art style before enhancing.",
        variant: "destructive",
      });
      return;
    }
    if (currentPrompt.length < 7) {
      toast({
        title: "Error",
        description: "Prompt must be at least 7 characters to enhance.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await axios.post('/api/prompt', { prompt: currentPrompt, style: currentStyle });
      const { enhancedPrompt } = response.data;

      if (enhancedPrompt) {
        const cleanedText = enhancedPrompt.replace(/^(As an AI art prompt expert,|Here's the enhanced prompt:|Enhanced version:|I would enhance it to:)/i, "").trim();
        form.setValue("prompt", cleanedText, { shouldValidate: true });
        toast({
          title: "Prompt Enhanced",
          description: "Your prompt has been enhanced with details.",
        });
      }
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance the prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      // find() to get the style object
      const selectedStyle = styleOptions.find(style => style.id === values.style);
      // Fallback in case style is not found, although validation should prevent this.
      const styleName = selectedStyle ? selectedStyle.name : ''; 
      
      const payload = {
        ...values,
        prompt: `${styleName} style, ${values.prompt}`
      };

      const response = await axios.post('/api/image', payload);
      setOutputImg(response.data.image);
      
      toast({
        variant: "default",
        description: "Image Generated Successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || "An unknown error occurred.";
      toast({
        variant: "destructive",
        description: errorMessage,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4 pt-[72px]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Image</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals using AI. Enter a detailed prompt, select your model, and choose an aspect ratio.
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-8">
          <div className="lg:w-2/3 space-y-8 bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-white">
              <IconWand className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Image Generator</h2>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="E.g., A serene landscape with mountains at sunset..."
                              className="h-12 lg:h-14 bg-zinc-800/50 pr-12 text-base"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 disabled:opacity-50"
                              onClick={enhancePrompt}
                              disabled={isEnhancing || field.value.length < 7}
                              title="Enhance prompt with AI"
                            >
                              {isEnhancing ? <BiLoaderCircle className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            </Button>
                          </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2"><IconRobot className="w-4 h-4 text-purple-400" /><p className="text-sm text-zinc-400">AI Model</p></div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {modelOptions.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <span className="font-medium">{model.name}</span>
                                  <span className="text-xs text-zinc-400 block">{model.desc}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2"><IconPalette className="w-4 h-4 text-purple-400" /><p className="text-sm text-zinc-400">Art Style</p></div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Choose style" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {styleOptions.map((style) => (
                              <SelectItem key={style.id} value={style.id}>
                                <div>
                                  <span className="font-medium">{style.name}</span>
                                  <span className="text-xs text-zinc-400 block">{style.desc}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2"><IconAspectRatio className="w-4 h-4 text-purple-400" /><p className="text-sm text-zinc-400">Aspect Ratio</p></div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Choose ratio" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {aspectRatioOptions.map((ratio) => (
                              <SelectItem key={ratio.id} value={ratio.id}>
                                <div>
                                  <span className="font-medium">{ratio.name}</span>
                                  <span className="text-xs text-zinc-400 block">{ratio.desc}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <li>The selected style is automatically added to your prompt.</li>
                        <li>Specify lighting and mood (e.g., sunset, dramatic).</li>
                        <li>Add color preferences (e.g., vibrant, monochrome).</li>
                        <li>Mention composition (e.g., close-up, aerial view).</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-6 text-lg">
                  {loading ? <span className="flex items-center gap-2">Generating <BiLoaderCircle className="animate-spin" /></span> : "Generate Image"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div
                  className="relative bg-zinc-800/50 rounded-lg overflow-hidden transition-all duration-300"
                  style={{ aspectRatio: watchedRatio || "1/1" }}
                >
                  {outputImg ? (
                    <Image alt="Generated image" src={outputImg} fill className="object-cover" priority quality={100} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm text-center p-4">
                      Your generated image will appear here
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-zinc-400">
                  <IconInfoCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Generated images will match the selected aspect ratio. You can download them after generation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}