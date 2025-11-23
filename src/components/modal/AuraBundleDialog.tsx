"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuraBundleForm, { AuraFormValues } from "../pages/shop-management/AuraBundleForm";

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: AuraFormValues) => Promise<void> | void;
  initialValues?: Partial<AuraFormValues>;
  title?: string;
};

export default function AuraBundleDialog({
  trigger,
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  title,
}: Props) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const close = () => handleOpenChange(false);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger as React.ReactElement}</DialogTrigger> : null}
      <DialogContent className="max-w-lg sm:max-w-xl bg-white px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {title ?? "Add New Aura Bundle"}
          </DialogTitle>
        </DialogHeader>

        <AuraBundleForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={close}
          afterSubmit={close}
          submitLabel={
            title?.toLowerCase().includes("edit") ? "Update" : "Save"
          }
        />
      </DialogContent>
    </Dialog>
  );
}
