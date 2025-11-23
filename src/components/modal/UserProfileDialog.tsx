"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type UserProfileDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user?: {
    id: number;
    userName: string;
    email: string;
    location: string;
    phoneNumber: string;
    joiningDate: string;
    status: "Active" | "Inactive";
    userType?: "Admin" | "Moderator" | "User";
    avatarUrl?: string; // optional avatar
    passportPhotoUrl?: string; // optional passport photo
  } | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserProfileDialog({
  open,
  onOpenChange,
  user,
}: UserProfileDialogProps) {
  const close = () => onOpenChange(false);
  const [passportErrored, setPassportErrored] = React.useState(false);

  React.useEffect(() => {
    // Reset error state when dialog opens with a different user
    setPassportErrored(false);
  }, [user?.id, open]);

  if (!user) return null;

  const hasPassport = Boolean(user.passportPhotoUrl) && !passportErrored;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl bg-white px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-[20px]">User Profile</DialogTitle>
          <DialogDescription className="text-sm">
            #{user.id} • {user.userType ?? "User"}
          </DialogDescription>
        </DialogHeader>

        {/* Image & basic info */}
        <div className="flex items-center gap-4 pb-4">
          {/* Avatar */}
          <div className="relative h-20 w-20 rounded-full overflow-hidden ring-1 ring-[#E6E7EB] bg-gray-100 shrink-0">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.userName} avatar`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
                priority={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-600">
                {getInitials(user.userName || "U")}
              </div>
            )}
          </div>

          {/* Name + email inline */}
          <div className="min-w-0">
            <div className="text-base font-medium text-[#100F0E] truncate">
              {user.userName}
            </div>
            <div className="text-sm text-gray-600 truncate">{user.email}</div>
            <div
              className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                user.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
              }`}
              aria-label={`Status: ${user.status}`}
            >
              {user.status}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">User Name</div>
            <div className="text-[#100F0E]">{user.userName}</div>
          </div>
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">Email</div>
            <div className="text-[#100F0E] break-all">{user.email}</div>
          </div>
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">Location</div>
            <div className="text-[#100F0E]">{user.location}</div>
          </div>
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">Phone Number</div>
            <div className="text-[#100F0E]">{user.phoneNumber}</div>
          </div>
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">Joining Date</div>
            <div className="text-[#100F0E]">{user.joiningDate}</div>
          </div>
          <div className="rounded-md border border-[#E6E7EB] bg-white/60 p-3">
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-[#100F0E]">{user.status}</div>
          </div>
        </div>

        {/* Passport photo */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-[#100F0E]">
              Passport Photo
            </div>
            {hasPassport && (
              <a
                href={user.passportPhotoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#00bcd4] hover:underline"
              >
                View full
              </a>
            )}
          </div>

          {/* Preview box */}
          <div className="rounded-xl border border-dashed border-[#D5D8E1] p-4 text-center bg-white/60">
            {hasPassport ? (
              <Image
                src={user.passportPhotoUrl as string}
                alt="Passport preview"
                className="mx-auto rounded-md object-cover"
                width={192} /* w-48 = 12rem = 192px */
                height={144} /* h-36 = 9rem = 144px */
                onError={() => setPassportErrored(true)}
              />
            ) : (
              <div className="text-xs text-gray-600">
                No passport photo available.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={close}
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
