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

// ── Types ──────────────────────────────────────────────────────────────────────
export type UserReportDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "view" | "edit";
  user?: {
    id: number;
    userName: string;
    email: string;
    avatarUrl?: string; // optional avatar for header
  } | null;

  // Optional data for the "Appeals" tab
  appeal?: {
    receivedDate: string; // e.g. "2025-09-09"
    text: string;
    status?: "Pending Review" | "Approved" | "Rejected";
  };

  // Optional data for the "Reports" tab (original report details)
  reportDetails?: {
    date: string; // e.g. "2025-09-08"
    reportedBy: string; //
    reason: string; // e.g. "Spamming in chat."
  };

  // Optional callbacks for the action buttons (Appeals tab)
  onUpholdSuspension?: () => void;
  onOverturnSuspension?: () => void;
};

// ── Utils ─────────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UserReportDialog({
  open,
  onOpenChange,
  mode,
  user,
  appeal,
  reportDetails,
  onUpholdSuspension,
  onOverturnSuspension,
}: UserReportDialogProps) {
  // Local tab state to mirror the screenshot
  const [tab, setTab] = React.useState<"appeals" | "reports">("appeals");

  // Demo defaults so the UI is never empty
  const u = user ?? {
    id: 0,
    userName: "Tae Collins",
    email: "tae.c@example.com",
    avatarUrl: "/avatars/default.png",
  };

  const appealData = appeal ?? {
    receivedDate: "2025-09-09",
    text: '"I believe the report was a mistake. My message was not spam, it was a relevant link to the topic we were discussing. I request you to please review my case."',
    status: "Pending Review" as const,
  };

  const reportData = reportDetails ?? {
    date: "2025-09-08",
    reportedBy: "Mijanur Rahman",
    reason: "Spamming in chat.",
  };

  const close = () => onOpenChange(false);

  const handleUphold = () => {
    onUpholdSuspension?.();
    close();
  };

  const handleOverturn = () => {
    onOverturnSuspension?.();
    close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white px-6 py-5">
        {/* Header (avatar + name + email) */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden ring-1 ring-[#E6E7EB] bg-gray-100 shrink-0">
            {u.avatarUrl ? (
              <Image
                src={u.avatarUrl}
                alt={`${u.userName} avatar`}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-base font-semibold text-gray-600">
                {getInitials(u.userName || "U")}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl leading-6 text-[#100F0E]">
                {u.userName}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {u.email}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Close button sits in Dialog chrome already; no extra control needed */}
        </div>

        {/* Tabs row */}
        <div className="mt-4 border-b border-gray-200">
          <div className="flex gap-6 text-base">
            <button
              type="button"
              onClick={() => setTab("appeals")}
              className={`pb-2 font-semibold ${
                tab === "appeals"
                  ? "text-[#1CA9E7] border-b-2 border-[#1CA9E7]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Appeals
            </button>
            <button
              type="button"
              onClick={() => setTab("reports")}
              className={`pb-2 font-semibold ${
                tab === "reports"
                  ? "text-[#1CA9E7] border-b-2 border-[#1CA9E7]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {tab === "appeals" ? (
            <div className="rounded-xl border border-[#E6E7EB] bg-white/70 p-4">
              {/* Row: Appeal Received + Status pill */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#100F0E]">
                  <span className="font-medium">Appeal Received:</span>{" "}
                  {appealData.receivedDate}
                </div>
                {appealData.status && (
                  <span className="inline-flex items-center rounded-full border border-[#7bd0ff] bg-[#E6F7FF] px-3 py-1 text-xs font-medium text-[#1677ff]">
                    {appealData.status}
                  </span>
                )}
              </div>

              {/* Appeal text (blue outline box) */}
              <div className="mt-3 rounded-lg border-2 border-[#67C3F3] bg-white px-3 py-3 text-sm text-[#100F0E]">
                {mode === "view" ? (
                  <>{appealData.text}</>
                ) : (
                  // If you want to support editing later, you can swap to a textarea here
                  <>{appealData.text}</>
                )}
              </div>

              {/* Divider */}
              <div className="my-4 h-px w-full bg-gray-200" />

              {/* Original Report Details */}
              <div className="text-sm font-medium text-[#100F0E]">
                Original Report Details
              </div>
              <div className="mt-2 rounded-lg border-2 border-[#67C3F3] bg-white px-3 py-3 text-sm text-[#100F0E]">
                <div>Date: {reportData.date}</div>
                <div>Reported By: {reportData.reportedBy}</div>
                <div>Reason: {reportData.reason}</div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  onClick={handleUphold}
                  className="bg-[#F04438] hover:bg-[#DC2626] text-white rounded-lg"
                >
                  Uphold Suspension
                </Button>
                <Button
                  onClick={handleOverturn}
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg"
                >
                  Overturn Suspension
                </Button>
              </div>
            </div>
          ) : (
            // Reports tab body – basic placeholder. You can tailor with your own fields.
            <div className="rounded-xl border border-[#E6E7EB] bg-white/70 p-4 text-sm text-[#100F0E]">
              <div className="font-medium mb-2">User Reports</div>
              <div className="rounded-lg border border-[#D5D8E1] bg-white px-3 py-3">
                No additional reports to show.
              </div>
            </div>
          )}
        </div>

        {/* Footer (optional close) */}
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={close}
            className="bg-white/10 hover:bg-white/20 text-[#100F0E] border border-[#D5D8E1] rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
