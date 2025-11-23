"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreateEventForm, CreateEventFormValues,
} from "@/components/pages/event-management/CreateEventForm";

type CreateEventDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: CreateEventFormValues) => Promise<void> | void;
  initialValues?: Partial<CreateEventFormValues>;
  initialImageUrl?: string; // NEW
};

export default function CreateEventDialog({
  trigger, open, onOpenChange, onSubmit, initialValues, initialImageUrl,
}: CreateEventDialogProps) {
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
            {initialValues ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <CreateEventForm
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
