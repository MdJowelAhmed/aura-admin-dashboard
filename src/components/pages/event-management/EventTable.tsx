"use client";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { EventRow } from "./EventManagement";

interface TableProps {
  bundles: EventRow[];
  toggleStates: Record<number, boolean>;
  handleToggle: (id: number) => void;
  headerNames: string[];
  onEdit: (row: EventRow) => void;
  onDelete: (id: number) => void;
}

export function Table({
  bundles,
  toggleStates,
  handleToggle,
  headerNames,
  onEdit,
  onDelete,
}: TableProps) {
  const formatDisplay = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="bg-white/20 mt-4 rounded-lg backdrop-blur-sm px-6 py-4 mb-2 border border-white/30">
        <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_80px_160px] gap-4 text-[16px] font-medium text-white">
          {headerNames.map((header, i) => (
            <div
              key={i}
              className={`whitespace-nowrap ${
                i === headerNames.length - 1 ? "text-center" : ""
              }`}
            >
              {header}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/20 overflow-x-auto max-w-full">
        <div className="p-4 space-y-4">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 hover:bg-white/95 transition-all duration-200"
            >
              <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_80px_160px] gap-4 items-center text-sm">
                <div className="text-[#100F0E] font-medium ml-3">
                  {bundle.id}
                </div>
                <div className="text-[#100F0E] font-medium flex items-center gap-2">
                  {/* <Image
                    src="/aura-logo.png"
                    alt="Event"
                    width={36}
                    height={36}
                    className="rounded-full invert"
                  /> */}
                  <span>{bundle.eventName}</span>
                </div>
                <div className="text-[#100F0E]">{bundle.eventType}</div>
                <div className="text-[#100F0E]">
                  {formatDisplay(bundle.startTimeISO)}
                </div>
                <div className="text-[#100F0E]">
                  {formatDisplay(bundle.endTimeISO)}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      toggleStates[bundle.id]
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {toggleStates[bundle.id] ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center gap-2 w-[125px] mx-auto border border-cyan-500 rounded-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(bundle)}
                    className="w-8 h-8 p-0 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>

                  <button
                    onClick={() => handleToggle(bundle.id)}
                    className={`relative inline-flex h-4 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      toggleStates[bundle.id] ? "bg-cyan-500" : "bg-gray-300"
                    }`}
                    title="Toggle status"
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        toggleStates[bundle.id]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(bundle.id)}
                    className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {bundles.length === 0 && (
            <div className="text-center text-white/90 py-6">
              No events found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
