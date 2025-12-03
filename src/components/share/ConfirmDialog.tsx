"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    // toast.success("Operation completed successfully");
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 text-white rounded-xl p-6">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-sm opacity-90 mb-5">{description}</p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-white/20 border-white/30 text-white rounded-lg h-10"
                  disabled={loading}
                >
                  {cancelText}
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white h-10 px-5 rounded-lg flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {confirmText}
                </Button>
              </div>
            </motion.div>

          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
