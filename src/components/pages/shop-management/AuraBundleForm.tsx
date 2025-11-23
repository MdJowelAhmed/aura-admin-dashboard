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

export const auraSchema = z.object({
  aura: z
    .string()
    .min(1, "Enter aura")
    .refine((v) => Number(v) > 0, "Must be greater than 0"),
  amount: z
    .string()
    .min(1, "Enter amount")
    .refine((v) => Number(v) >= 0, "Must be 0 or greater"),
});

export type AuraFormValues = z.infer<typeof auraSchema>;

type Props = {
  initialValues?: Partial<AuraFormValues>;
  onSubmit: (values: AuraFormValues) => Promise<void> | void;
  onCancel?: () => void;
  afterSubmit?: () => void;
  submitLabel?: string;
};

export default function AuraBundleForm({
  initialValues,
  onSubmit,
  onCancel,
  afterSubmit,
  submitLabel = "Save",
}: Props) {
  const form = useForm<AuraFormValues>({
    resolver: zodResolver(auraSchema),
    defaultValues: {
      aura: initialValues?.aura ?? "",
      amount: initialValues?.amount ?? "",
    },
  });

  const submit = async (values: AuraFormValues) => {
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
          name="aura"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Aura</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="e.g. 4.99"
                  {...field}
                />
              </FormControl>
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
