import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";

export interface PackageRow {
  id: number;
  packageName: string;
  duration: string; // "7 days"
  price: string; // "$4.99"
  userPurchase: string;
  createdOn: string; // "01-02-2025"
  status: "Active" | "Inactive";
}

interface TableProps {
  rows: PackageRow[];
  toggleStates: Record<number, boolean>;
  handleToggle: (id: number) => void;
  headerNames: string[];
  onEdit: (row: PackageRow) => void;
  onDelete: (id: number) => void;
}

export function Table({
  rows,
  toggleStates,
  handleToggle,
  headerNames,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white/20 mt-4 rounded-lg backdrop-blur-sm px-6 py-4 mb-2 border border-white/30">
        {/* 8 columns: SL | Package Name | Duration | Price | User Purchase | Created On | Status | Action */}
        <div className="grid grid-cols-[50px_1fr_140px_120px_1fr_1fr_90px_160px] gap-4 text-[16px] font-medium text-white">
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

      {/* Body */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/20 overflow-x-auto max-w-full">
        <div className="p-4 space-y-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 hover:bg-white/95 transition-all duration-200"
            >
              <div className="grid grid-cols-[50px_1fr_140px_120px_1fr_1fr_90px_160px] gap-4 items-center text-sm">
                {/* SL */}
                <div className="text-[#100F0E] font-medium ml-3">{row.id}</div>

                {/* Package Name */}
                <div className="text-[#100F0E] font-medium">
                  {row.packageName}
                </div>

                {/* Duration */}
                <div className="text-[#100F0E]">{row.duration}</div>

                {/* Price */}
                <div className="text-[#100F0E]">{row.price}</div>

                {/* User Purchase */}
                <div className="text-[#100F0E]">{row.userPurchase}</div>

                {/* Created On */}
                <div className="text-[#100F0E]">{row.createdOn}</div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      toggleStates[row.id]
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {toggleStates[row.id] ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Action */}
                <div className="flex justify-center items-center gap-2 w-[125px] mx-auto border border-cyan-500 rounded-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(row)}
                    className="w-8 h-8 p-0 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>

                  <button
                    onClick={() => handleToggle(row.id)}
                    className={`relative inline-flex h-4 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      toggleStates[row.id] ? "bg-cyan-500" : "bg-gray-300"
                    }`}
                    aria-label={`Toggle status for row ${row.id}`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        toggleStates[row.id] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row.id)}
                    className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="text-center text-sm text-gray-700 py-8">
              No packages found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
