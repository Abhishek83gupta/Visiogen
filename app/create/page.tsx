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
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be at least 7 characters!" }),
});

export default function page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status == 200) {
        toast({ variant: "default", description: "Image Generated Successfully" });
        setOutputImg(data.image);
      } else {
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-3 h-screen flex justify-center items-center pt-[72px] flex-col lg:mt-0 mt-10 overflow-hidden">
    <div className="w-full p-3">
      <h1 className="text-center font-bold text-white text-4xl">Create</h1>
      <p className="text-center w-full text-sm text-white/80">
        Generate Stunning Images with AI
      </p>
    </div>
  
    <div className="flex w-full gap-3 h-full lg:flex-row flex-col">
      {/* form */}
  
      <div className="__form lg:flex-[2] gap-2 flex justify-center items-center flex-col">
        <p className="text-center w-full lg:text-left text-sm text-white/80 mt-3">
          Type your prompt below to create any image you can imagine!
        </p>
  
        <div className="flex gap-2 w-full mt-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex gap-2"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-[70%]">
                    <FormControl>
                      <Input
                        placeholder="Type your prompt"
                        className="w-full transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button loading={loading} type="submit">
                Generate
              </Button>
            </form>
          </Form>
        </div>
      </div>
  
      {/* Image Output */}
      <div className="__output lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden min-h-[100px] md:min-h-[300px] lg:min-h-[400px]">
        {outputImg ? (
          <Image
            alt="output image"
            className="w-full h-full object-contain"
            src={outputImg}
            height={300}
            width={300}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
            Enter your prompt and hit generate!
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
}