"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** Context to share open state between parts */
type DialogCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
};
const Ctx = createContext<DialogCtx | null>(null);

type DialogProps = {
  /** Controlled open (optional). If omitted, component is uncontrolled. */
  open?: boolean;
  /** Called whenever open state changes. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({
  open: openProp,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? (openProp as boolean) : uncontrolledOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useDialogCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

/** Trigger */
type TriggerProps = {
  asChild?: boolean;
  children: React.ReactElement;
};
export function DialogTrigger({ asChild, children }: TriggerProps) {
  const { setOpen } = useDialogCtx();

  const onClick = (e: React.MouseEvent) => {
    const childProps = children.props as React.Attributes & { onClick?: (e: React.MouseEvent) => void };
    childProps?.onClick?.(e);
    setOpen(true);
  };

  if (asChild) {
    return React.cloneElement(children, {
      onClick: onClick,
      "aria-haspopup": "dialog",
      "aria-expanded": true,
    } as React.Attributes & React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button onClick={onClick} aria-haspopup="dialog" aria-expanded={true}>
      {children}
    </button>
  );
}

/** Content (modal body with backdrop) */
type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Extra class for container (panel) */
  className?: string;
};
export function DialogContent({ className, children, ...props }: ContentProps) {
  const { open, setOpen } = useDialogCtx();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        onClick={stop}
        className={cn(
          "relative mx-4 w-full max-w-lg rounded-xl border bg-white p-0 text-gray-900 shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/** Header / Title helpers (match shadcn API shape) */
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1 mb-4", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

/** Optional: Description helper if you use it later */
export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-600", className)} {...props} />;
}