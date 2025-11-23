"use client";


import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  HTMLAttributes,
  MouseEvent,
} from "react";
import { cn } from "@/lib/utils";


type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
};
const DropdownCtx = createContext<Ctx | null>(null);


export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);


  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  return (
    <DropdownCtx.Provider value={{ open, setOpen, triggerRef: triggerRef as React.RefObject<HTMLElement> }}>
      <div className="relative inline-block">{children}</div>
    </DropdownCtx.Provider>
  );
}


function useDropdownCtx() {
  const ctx = useContext(DropdownCtx);
  if (!ctx)
    throw new Error("Dropdown components must be inside <DropdownMenu>");
  return ctx;
}


type TriggerProps = {
  asChild?: boolean;
  children: React.ReactElement;
};
export function DropdownMenuTrigger({ asChild, children }: TriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownCtx();


  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };


  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = triggerRef.current;
      if (!t) return;
      const content = document.getElementById("__dropdown-content");
      const target = e.target as Node;
      if (t.contains(target)) return;
      if (content && content.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("click", onDocClick as unknown as EventListener);
    return () => document.removeEventListener("click", onDocClick as unknown as EventListener);
  }, [setOpen, triggerRef]);


  if (asChild) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick,
      className: cn((children as React.ReactElement<{ className?: string }>).props?.className),
      "aria-haspopup": "menu",
      "aria-expanded": open,
    } as React.Attributes & React.RefAttributes<unknown>);
  }


  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn((children as React.ReactElement<{ className?: string }>).props?.className)}
    >
      {children}
    </button>
  );
}


type ContentProps = HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "end" | "center";
  sideOffset?: number;
};
export function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  style,
  ...props
}: ContentProps) {
  const { open, setOpen, triggerRef } = useDropdownCtx();
  const ref = useRef<HTMLDivElement>(null);


  // position under trigger
  useEffect(() => {
    if (!open || !triggerRef.current || !ref.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();


    const top = triggerRect.height + sideOffset;
    // left alignment inside the relatively positioned wrapper
    ref.current.style.top = `${top}px`;
    // align handling by CSS classes below
  }, [open, sideOffset, triggerRef]);


  if (!open) return null;


  return (
    <div
      id="__dropdown-content"
      ref={ref}
      role="menu"
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md focus:outline-none",
        align === "end"
          ? "right-0"
          : align === "center"
          ? "left-1/2 -translate-x-1/2"
          : "left-0",
        className
      )}
      style={style}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
      {...props}
    />
  );
}


export function DropdownMenuItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      role="menuitem"
      className={cn(
        "w-full select-none rounded-sm px-2 py-1.5 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        className
      )}
      {...props}
    />
  );
}


export function DropdownMenuLabel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-gray-700",
        className
      )}
      {...props}
    />
  );
}


export function DropdownMenuSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-gray-200", className)} {...props} />
  );
}


/* Optional no-ops to match shadcn's named exports API (if ever imported) */
export const DropdownMenuGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuPortal = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuSub = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuSubTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuSubContent = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuRadioGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const DropdownMenuCheckboxItem = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <DropdownMenuItem {...props} />
);
export const DropdownMenuRadioItem = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <DropdownMenuItem {...props} />
);
export const DropdownMenuShortcut = (
  props: HTMLAttributes<HTMLSpanElement>
) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest opacity-60",
      props.className
    )}
    {...props}
  />
);