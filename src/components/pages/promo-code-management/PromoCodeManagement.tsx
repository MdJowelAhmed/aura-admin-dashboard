"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Table } from "./PromoTable";
import type { PromoFormValues } from "./PromoForm";
import PromoDialog from "@/components/modal/PromoDialog";

// Helpers
function isoToDisplay(iso: string) {
  // Keep simple: show browser locale string
  const d = new Date(iso);
  return d.toLocaleString();
}
function displayToISO(s: string): string {
  // naive parse "DD-MM-YYYY hh:mm AM/PM"
  try {
    const [datePart, timePart, ampm] = s.split(" ");
    const [dd, mm, yyyy] = datePart.split("-").map(Number);
    let [hh] = timePart.split(":").map(Number);
    const minutes = timePart.split(":").map(Number)[1] || 0;
    if ((ampm || "").toUpperCase() === "PM" && hh < 12) hh += 12;
    if ((ampm || "").toUpperCase() === "AM" && hh === 12) hh = 0;
    const d = new Date(yyyy, (mm || 1) - 1, dd || 1, hh || 0, minutes, 0);
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// ===== Sample promo code data (display) =====
const initialDisplayData = [
  {
    id: 1,
    promoCode: "AURA50",
    type: "Percentage" as const,
    usageLimit: 200,
    startTime: "01-02-2025 10:00 AM",
    endTime: "15-02-2025 11:59 PM",
    status: "Active" as const,
  },
  {
    id: 2,
    promoCode: "CALL100",
    type: "Flat" as const,
    usageLimit: 50,
    startTime: "05-02-2025 09:00 AM",
    endTime: "20-02-2025 11:59 PM",
    status: "Active" as const,
  },
  {
    id: 3,
    promoCode: "PREMIUM25",
    type: "Percentage" as const,
    usageLimit: 100,
    startTime: "10-02-2025 12:00 PM",
    endTime: "28-02-2025 06:00 PM",
    status: "Inactive" as const,
  },
];

export type PromoRow = {
  id: number;
  promoCode: string;
  type: "Percentage" | "Flat";
  usageLimit: number;
  startISO: string;
  endISO: string;
  status: "Active" | "Inactive";
  imageUrl?: string;
};

type StatusFilter = "Status" | "Active" | "Inactive"; // "Status" shows all

export function PromoCodeManagement() {
  // Seed rows (convert display times to ISO for ease of editing)
  const seeded = useMemo<PromoRow[]>(
    () =>
      initialDisplayData.map((r) => ({
        id: r.id,
        promoCode: r.promoCode,
        type: r.type,
        usageLimit: r.usageLimit,
        startISO: displayToISO(r.startTime),
        endISO: displayToISO(r.endTime),
        status: r.status,
        imageUrl: undefined,
      })),
    []
  );

  const [promos, setPromos] = useState<PromoRow[]>(seeded);

  // Status filter (default "Status" => show all)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");

  // Toggle visual state
  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    seeded.reduce((acc, p) => {
      acc[p.id] = p.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // EDIT modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PromoRow | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleToggle = (id: number) => {
    setToggleStates((prev) => {
      const next = !prev[id];
      setPromos((rows) =>
        rows.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...prev, [id]: next };
    });
  };

  // Apply filter BEFORE pagination
  const filtered = promos.filter((p) =>
    statusFilter === "Status" ? true : p.status === statusFilter
  );

  // Derived pagination on filtered set
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPromos = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  // Pagination is handled directly in the UI components

  // ===== Headers (unchanged design) =====
  const headerNames = [
    "SL",
    "Promo Code",
    "Type",
    "Usage Limit",
    "Start Time",
    "End Time",
    "Status",
    "Action",
  ];

  // ===== Add Promo submit =====
  const handleCreatePromo = async (values: PromoFormValues) => {
    const nextId = Math.max(0, ...promos.map((p) => p.id)) + 1;

    const imageUrl = values.thumbnail
      ? URL.createObjectURL(values.thumbnail)
      : undefined;

    const newRow: PromoRow = {
      id: nextId,
      promoCode: values.promoCode,
      type: values.discountType, // "Percentage" | "Flat"
      usageLimit: Number(values.usageLimit),
      startISO: values.startDateTime,
      endISO: values.endDateTime,
      status: "Active", // default
      imageUrl,
    };

    setPromos((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Edit open
  const handleEditClick = (row: PromoRow) => {
    setEditing(row);
    setEditOpen(true);
  };

  // ===== Edit submit =====
  const handleUpdatePromo = async (values: PromoFormValues) => {
    if (!editing) return;

    const newImage = values.thumbnail
      ? URL.createObjectURL(values.thumbnail)
      : editing.imageUrl;

    setPromos((rows) =>
      rows.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              promoCode: values.promoCode,
              type: values.discountType,
              usageLimit: Number(values.usageLimit),
              startISO: values.startDateTime,
              endISO: values.endDateTime,
              imageUrl: newImage,
            }
          : r
      )
    );

    setEditOpen(false);
    setEditing(null);
  };

  // ===== Delete =====
  const handleDelete = (id: number) => {
    setPromos((rows) => rows.filter((r) => r.id !== id));
    setToggleStates((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    if (editing?.id === id) {
      setEditOpen(false);
      setEditing(null);
    }
  };

  // ===== Prefill for edit dialog =====
  const editInitialValues: Partial<PromoFormValues> | undefined = editing
    ? {
        promoCode: editing.promoCode,
        discountType: editing.type,
        value: "", // you can map back a default if needed
        usageLimit: String(editing.usageLimit),
        startDateTime: editing.startISO.slice(0, 16), // "YYYY-MM-DDTHH:MM"
        endDateTime: editing.endISO.slice(0, 16),
      }
    : undefined;

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        <div className="flex gap-3">
          {/* Status Filter (Status shows all) */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Status">Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Create New Promo */}
          <PromoDialog
            trigger={
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
                Create New Promo
              </Button>
            }
            onSubmit={handleCreatePromo}
            title="Create Promo"
          />
        </div>
      </div>

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          promos={currentPromos.map((p) => ({
            ...p,
            startTime: isoToDisplay(p.startISO),
            endTime: isoToDisplay(p.endISO),
          }))}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          headerNames={headerNames}
          onEdit={(row) => handleEditClick(row as unknown as PromoRow)}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-white/20 text-white"
              } rounded-lg px-4 py-2 hover:bg-cyan-400 transition-colors`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* EDIT (controlled) */}
      <PromoDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
        initialImageUrl={editing?.imageUrl}
        onSubmit={handleUpdatePromo}
        title="Edit Promo"
      />
    </div>
  );
}
