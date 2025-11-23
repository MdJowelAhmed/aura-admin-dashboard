"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type PromoFormValues = {
  promoCode: string;
  discountType: "Percentage" | "Flat";
  value: string;
  usageLimit: string;
  startDateTime: string;
  endDateTime: string;
  thumbnail?: File;
};

const PERCENT_VALUES = ["5%", "10%", "15%", "20%", "25%", "30%", "40%", "50%"];
const FLAT_VALUES = ["5", "10", "25", "50", "100", "200", "500"];

type Props = {
  initialValues?: Partial<PromoFormValues>;
  initialImageUrl?: string;
  onSubmit: (values: PromoFormValues) => Promise<void> | void;
  onCancel?: () => void;
  afterSubmit?: () => void;
};

function genPromoCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function PromoForm({
  initialValues,
  initialImageUrl,
  onSubmit,
  onCancel,
  afterSubmit,
}: Props) {
  const form = useForm<PromoFormValues>({
    defaultValues: {
      promoCode: initialValues?.promoCode ?? "",
      discountType: initialValues?.discountType ?? "Percentage",
      value: initialValues?.value ?? "",
      usageLimit: initialValues?.usageLimit ?? "",
      startDateTime: initialValues?.startDateTime ?? "",
      endDateTime: initialValues?.endDateTime ?? "",
      thumbnail: undefined,
    },
  });

  const watchType = form.watch("discountType");
  const [preview, setPreview] = React.useState<string | null>(
    initialImageUrl ?? null
  );

  const handleImageChange = (file?: File) => {
    form.setValue("thumbnail", file as File | undefined, { shouldValidate: true });
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(initialImageUrl ?? null);
  };

  const submit = async (values: PromoFormValues) => {
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

  const handleGenerate = () => {
    form.setValue("promoCode", genPromoCode(), { shouldValidate: true });
  };

  const valueOptions = watchType === "Flat" ? FLAT_VALUES : PERCENT_VALUES;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        {/* Promo Code with Generate button */}
        <FormField
          control={form.control}
          name="promoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promo Code</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="Enter promo code" {...field} />
                </FormControl>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3",
                    "bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-md border-none shadow"
                  )}
                >
                  Generate
                </Button>
              </div>
            </FormItem>
          )}
        />

        {/* Discount Type */}
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Flat">Flat</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Value */}
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {valueOptions.map((v) => (
                    <SelectItem key={v} value={v}>
                      {watchType === "Flat" ? `${v}` : v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Usage Limit */}
        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="Enter usage limit" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Start Date & Time */}
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* End Date & Time */}
        <FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Upload Thumbnail */}
        <FormField
          control={form.control}
          name="thumbnail"
          render={() => (
            <FormItem>
              <FormLabel>Upload Event Thumbnail</FormLabel>
              <FormControl>
                <div className="rounded-xl border border-dashed border-[#D5D8E1] p-6 text-center">
                  <label
                    htmlFor="promo-thumbnail"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Preview"
                        width={112}
                        height={112}
                        className="rounded-lg object-cover"
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
                    id="promo-thumbnail"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
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
