"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import Image from "next/image";

export const gameSchema = z.object({
  gameTitle: z.string().min(1, "Game title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= 2 * 1024 * 1024, "Image must be ≤ 2MB")
    .refine(
      (f) => !f || ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
      "Only .jpg / .jpeg / .png"
    ),
});

export type GameFormValues = z.infer<typeof gameSchema>;

type Props = {
  initialValues?: Partial<GameFormValues>;
  initialImageUrl?: string; // for edit preview
  onSubmit: (values: GameFormValues) => Promise<void> | void;
  onCancel?: () => void;
  afterSubmit?: () => void;
};

export function GameForm({
  initialValues,
  initialImageUrl,
  onSubmit,
  onCancel,
  afterSubmit,
}: Props) {
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      gameTitle: initialValues?.gameTitle ?? "",
      description: initialValues?.description ?? "",
      thumbnail: undefined,
    },
  });

  const [preview, setPreview] = React.useState<string | null>(
    initialImageUrl ?? null
  );

  const handleImageChange = (file?: File) => {
    form.setValue("thumbnail", file as File | undefined, { shouldValidate: true });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(initialImageUrl ?? null);
    }
  };

  const submit = async (values: GameFormValues) => {
    await onSubmit(values);
    form.reset();
    setPreview(null);
    afterSubmit?.();
  };

  const handleCancel = () => {
    form.reset();
    setPreview(null);
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        {/* Game Title */}
        <FormField
          control={form.control}
          name="gameTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter game title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormField
          control={form.control}
          name="thumbnail"
          render={() => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <div className="rounded-xl border border-dashed border-[#D5D8E1] p-6 text-center">
                  <label
                    htmlFor="game-thumbnail"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Preview"
                        width={112}
                        height={112}
                        className="h-28 w-28 rounded-lg object-cover"
                      />
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 opacity-70" />
                        <span className="text-sm text-gray-600">
                          Upload photo (Max: 2MB, .jpg, .jpeg, .png)
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id="game-thumbnail"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions (same look & feel) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-white/10 hover:bg-white/20 text-[#100F0E] border border-[#D5D8E1] rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-lg border-none shadow-md"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
