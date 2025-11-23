"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GameForm, GameFormValues } from "../pages/game-management/GameForm";

type GameDialogProps = {
  trigger?: React.ReactNode; // for Add usage
  open?: boolean; // for Edit usage
  onOpenChange?: (open: boolean) => void; // controlled optional
  onSubmit: (values: GameFormValues) => Promise<void> | void;
  initialValues?: Partial<GameFormValues>;
  initialImageUrl?: string;
  title?: string; // optional override ("Add Game" / "Edit Game")
};

export default function GameDialog({
  trigger,
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  initialImageUrl,
  title,
}: GameDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const close = () => handleOpenChange(false);

  const hdr = title ?? (initialValues ? "Edit Game" : "Add Game");

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger && typeof trigger !== "string" && typeof trigger !== "number" && typeof trigger !== "boolean" ? (
        <DialogTrigger asChild>{trigger as React.ReactElement}</DialogTrigger>
      ) : null}
      {/* keep same style language you've used elsewhere */}
      <DialogContent className="max-w-lg sm:max-w-xl bg-white px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-[22px]">{hdr}</DialogTitle>
        </DialogHeader>

        <GameForm
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
