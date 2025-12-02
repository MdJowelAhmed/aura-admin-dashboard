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
import { cn } from "@/lib/utils";

export type PromoFormValues = {
  promoCode: string;
  discountType: "Percentage" | "Flat";
  value: string;
  usageLimit: string;
  startDateTime: string;
  endDateTime: string;
};

const PERCENT_VALUES = ["5", "10", "15", "20", "25", "30", "40", "50"];
const FLAT_VALUES = ["5", "10", "25", "50", "100", "200", "500"];

type Props = {
  initialValues?: Partial<PromoFormValues>;
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
    },
  });

  const watchType = form.watch("discountType");

  // Reset value when discount type changes
  React.useEffect(() => {
    form.setValue("value", "", { shouldValidate: false });
  }, [watchType, form]);

  const submit = async (values: PromoFormValues) => {
    // Validate dates
    const start = new Date(values.startDateTime);
    const end = new Date(values.endDateTime);
    
    if (end <= start) {
      form.setError("endDateTime", {
        message: "End date must be after start date",
      });
      return;
    }

    // Validate value is selected
    if (!values.value || values.value.trim() === "") {
      form.setError("value", {
        message: "Please select a discount value",
      });
      return;
    }

    await onSubmit(values);
    form.reset();
    afterSubmit?.();
  };

  const handleCancel = () => {
    form.reset();
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
          rules={{ required: "Promo code is required" }}
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Value */}
        <FormField
          control={form.control}
          name="value"
          rules={{ required: "Please select a value" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Value {watchType === "Percentage" ? "(Percentage)" : "(Amount)"}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {valueOptions.map((v) => (
                    <SelectItem key={v} value={v}>
                      {watchType === "Percentage" ? `${v}%` : `৳${v}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Usage Limit */}
        <FormField
          control={form.control}
          name="usageLimit"
          rules={{ 
            required: "Usage limit is required",
            min: { value: 1, message: "Must be at least 1" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  placeholder="Enter usage limit" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date & Time */}
        <FormField
          control={form.control}
          name="startDateTime"
          rules={{ required: "Start date is required" }}
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
          rules={{ required: "End date is required" }}
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