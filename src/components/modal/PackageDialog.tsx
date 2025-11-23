"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PackageForm, { PackageFormValues } from "../pages/aura-package/PackageForm";

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: PackageFormValues) => Promise<void> | void;
  initialValues?: Partial<PackageFormValues>;
  title?: string;
};

export default function PackageDialog({
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
      {trigger && <DialogTrigger asChild>{trigger as React.ReactElement}</DialogTrigger>}
      <DialogContent className="max-w-lg sm:max-w-xl bg-white px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {title ?? "Create New Package"}
          </DialogTitle>
        </DialogHeader>

        <PackageForm
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
