"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import Image from "next/image";

export const createEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventType: z.string().min(1, "Event type is required"),
  state: z.string().min(1, "State is required"),
  startDateTime: z.string().min(1, "Start date & time is required"),
  endDateTime: z.string().min(1, "End date & time is required"),
  thumbnail: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= 2 * 1024 * 1024, "Image must be ≤ 2MB")
    .refine(
      (f) => !f || ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
      "Only .jpg / .jpeg / .png"
    ),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

// keep your options
const EVENT_TYPES = [
  { label: "Unlimited Ad Time", value: "unlimited_ad_time" },
  { label: "Limited Slots", value: "limited_slots" },
  { label: "Premium Event", value: "premium" },
];

const STATES = [
  { label: "California", value: "California" },
  { label: "Texas", value: "Texas" },
  { label: "New York", value: "New York" },
  { label: "Florida", value: "Florida" },
];

type Props = {
  initialValues?: Partial<CreateEventFormValues>;
  onSubmit: (values: CreateEventFormValues) => Promise<void> | void;
  onCancel?: () => void;
  afterSubmit?: () => void;
  /** For edit: show existing image preview (cannot prefill file input) */
  initialImageUrl?: string;
};

export function CreateEventForm({
  initialValues,
  onSubmit,
  onCancel,
  afterSubmit,
  initialImageUrl,
}: Props) {
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventName: initialValues?.eventName ?? "",
      eventType: initialValues?.eventType ?? EVENT_TYPES[0].value,
      state: initialValues?.state ?? "",
      startDateTime: initialValues?.startDateTime ?? "",
      endDateTime: initialValues?.endDateTime ?? "",
      thumbnail: undefined,
    },
  });

  const [preview, setPreview] = React.useState<string | null>(
    initialImageUrl ?? null
  );

  const handleImageChange = (file?: File) => {
    form.setValue("thumbnail", file as z.infer<typeof createEventSchema>["thumbnail"], { shouldValidate: true });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      // If user clears file, keep existing preview if initialImageUrl exists
      setPreview(initialImageUrl ?? null);
    }
  };

  const submit = async (values: CreateEventFormValues) => {
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
        {/* Event Name */}
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Type */}
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select state</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
                    htmlFor="event-thumbnail"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    {preview ? (
                      <div className="relative h-28 w-28 rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
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
                    id="event-thumbnail"
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
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
