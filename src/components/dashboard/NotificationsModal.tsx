"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time?: string; // e.g., "2 min ago"
  read?: boolean;
};

type NotificationsModalProps = {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onItemClick?: (id: string) => void; // e.g., mark as read or navigate
};

const NotificationsModal = ({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onItemClick,
}: NotificationsModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus first button
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const firstBtn =
      dialogRef.current.querySelector<HTMLButtonElement>("#notif-close");
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
      aria-labelledby="notif-title"
      aria-describedby="notif-desc"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        onClick={stop}
        className="relative mx-4 w-full max-w-2xl rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-3">
          <div>
            <h3 id="notif-title" className="text-xl font-semibold text-white">
              Notifications
            </h3>
            <p id="notif-desc" className="mt-1 text-sm text-white/80">
              See all recent activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onMarkAllRead}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg"
              variant="outline"
            >
              Mark all as read
            </Button>
            <Button
              id="notif-close"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="px-6 pb-6">
          <div className="max-h-[70vh] overflow-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center text-white/90 py-12">
                No notifications
              </div>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => onItemClick?.(n.id)}
                      className={cn(
                        "w-full text-left rounded-xl border border-white/20 bg-white/30 hover:bg-white/40 backdrop-blur p-4 transition-colors",
                        !n.read && "ring-1 ring-cyan-300/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[15px] font-semibold text-[#100F0E]">
                            {n.title}
                          </div>
                          {n.description && (
                            <div className="mt-1 text-sm text-[#100F0E]/90">
                              {n.description}
                            </div>
                          )}
                        </div>
                        {n.time && (
                          <div className="shrink-0 text-xs text-[#100F0E]/70">
                            {n.time}
                          </div>
                        )}
                      </div>
                      {!n.read && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] font-medium text-cyan-800">
                          New
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
