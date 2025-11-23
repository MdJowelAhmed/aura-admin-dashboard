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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const callSchema = z.object({
  time: z
    .string()
    .min(1, "Enter time")
    .refine((v) => Number(v) > 0, "Must be greater than 0"),
  auraNeeded: z.string().min(1, "Select aura needed"),
});

export type CallFormValues = z.infer<typeof callSchema>;

const AURA_OPTIONS = ["50", "100", "200", "500", "1000", "2000", "3000"];

type Props = {
  initialValues?: Partial<CallFormValues>;
  onSubmit: (values: CallFormValues) => Promise<void> | void;
  onCancel?: () => void;
  afterSubmit?: () => void;
  submitLabel?: string;
};

export default function CallBundleForm({
  initialValues,
  onSubmit,
  onCancel,
  afterSubmit,
  submitLabel = "Save",
}: Props) {
  const form = useForm<CallFormValues>({
    resolver: zodResolver(callSchema),
    defaultValues: {
      time: initialValues?.time ?? "",
      auraNeeded: initialValues?.auraNeeded ?? "",
    },
  });

  const submit = async (values: CallFormValues) => {
    await onSubmit(values);
    form.reset();
    afterSubmit?.();
  };

  const cancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Time</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 10 (minutes)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auraNeeded"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aura Needed Value</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aura needed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AURA_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={cancel}
            className="bg-white/10 hover:bg-white/20 text-[#100F0E] border border-[#D5D8E1] rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-lg border-none shadow-md"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
