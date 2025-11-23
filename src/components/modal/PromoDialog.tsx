"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PromoForm,
  PromoFormValues,
} from "../pages/promo-code-management/PromoForm";

type PromoDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: PromoFormValues) => Promise<void> | void;
  initialValues?: Partial<PromoFormValues>;
  initialImageUrl?: string;
  title?: string;
};

export default function PromoDialog({
  trigger,
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  initialImageUrl,
  title,
}: PromoDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const close = () => handleOpenChange(false);

  const hdr = title ?? (initialValues ? "Edit Promo" : "Create Promo");

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger as React.ReactElement}</DialogTrigger> : null}
      <DialogContent className="max-w-lg sm:max-w-xl bg-white px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-[22px]">{hdr}</DialogTitle>
        </DialogHeader>

        <PromoForm
          initialValues={initialValues}
          initialImageUrl={initialImageUrl}
          onSubmit={onSubmit}
          onCancel={close}
          afterSubmit={close}
        />
      </DialogContent>
    </Dialog>
  );
}
