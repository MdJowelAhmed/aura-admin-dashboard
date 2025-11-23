"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ConfirmLogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmLogoutModal = ({
  open,
  onClose,
  onConfirm,
}: ConfirmLogoutModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // focus first interactive element when opened
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const firstBtn =
      dialogRef.current.querySelector<HTMLButtonElement>("#logout-cancel");
    firstBtn?.focus();
  }, [open]);

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        onClick={stop}
        className="relative mx-4 w-full max-w-sm rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl"
      >
        <div className="px-4 py-8 flex flex-col items-center">
          {/* <h3 id="logout-title" className="text-xl font-semibold text-white">
            Confirm Logout
          </h3> */}
          <Image
            src="/LogOutIcon.png"
            alt="Aura Logo"
            width={100}
            height={100}
          />
          <p
            id="logout-desc"
            className="mt-6 text-[24px] font-medium text-center text-white/90"
          >
            Do you want to Logout?
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              id="logout-cancel"
              onClick={onClose}
              className="bg-white text-black px-8 rounded-lg hover:bg-white/50 text-[16px]"
              variant="outline"
            >
              No
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-white text-black px-8 rounded-lg hover:bg-white/50 text-[16px]"
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
