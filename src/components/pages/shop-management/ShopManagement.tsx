// ShopManagement.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Table, BundleRow } from "./ShopTable";
import type { AuraFormValues } from "./AuraBundleForm";
import type { CallFormValues } from "./CallBundleForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import AuraBundleDialog from "@/components/modal/AuraBundleDialog";
import CallBundleDialog from "@/components/modal/CallBundleDialog";

// Helpers
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

type StatusFilter = "Status" | "Active" | "Inactive";
type BundleFilter = "All" | "Aura Bundle" | "Call Bundle";

// Sample bundle data (internal field bundleType added; not shown in table)
const seedData: BundleRow[] = [
  {
    id: 1,
    bundleType: "Aura",
    totalAura: "550",
    totalPrice: "$4.99",
    userPurchase: "2000",
    createdOn: "01-02-2025",
    status: "Active",
  },
  {
    id: 2,
    bundleType: "Call",
    totalAura: "100", // Aura needed
    totalPrice: "10 min", // Time
    userPurchase: "950",
    createdOn: "02-02-2025",
    status: "Active",
  },
  {
    id: 3,
    bundleType: "Aura",
    totalAura: "3000",
    totalPrice: "$19.99",
    userPurchase: "120",
    createdOn: "03-02-2025",
    status: "Inactive",
  },
];

export function ShopManagement() {
  const [rows, setRows] = useState<BundleRow[]>(seedData);

  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    seedData.reduce((acc, b) => {
      acc[b.id] = b.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");
  const [bundleFilter, setBundleFilter] = useState<BundleFilter>("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Edit modal state
  const [editAuraOpen, setEditAuraOpen] = useState(false);
  const [editCallOpen, setEditCallOpen] = useState(false);
  const [editing, setEditing] = useState<BundleRow | null>(null);

  // Handle toggle
  const handleToggle = (id: number) => {
    setToggleStates((prev) => {
      const next = !prev[id];
      setRows((rs) =>
        rs.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...prev, [id]: next };
    });
  };

  // Filtering (apply BEFORE pagination)
  const filtered = rows.filter((r) => {
    const statusOk =
      statusFilter === "Status" ? true : r.status === statusFilter;
    const bundleOk =
      bundleFilter === "All"
        ? true
        : bundleFilter === "Aura Bundle"
        ? r.bundleType === "Aura"
        : r.bundleType === "Call";
    return statusOk && bundleOk;
  });

  // Pagination from filtered
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBundles = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const headerNames = [
    "SL",
    "Total Aura",
    "Total Price",
    "User Purchase",
    "Created On",
    "Status",
    "Action",
  ];

  // Add New Aura Bundle
  const handleAddAura = async (values: AuraFormValues) => {
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    const newRow: BundleRow = {
      id: nextId,
      bundleType: "Aura",
      totalAura: String(Number(values.aura)),
      totalPrice: `$${Number(values.amount).toFixed(2)}`,
      userPurchase: "0",
      createdOn: formatDate(new Date()),
      status: "Active",
    };
    setRows((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Add New Call Bundle
  const handleAddCall = async (values: CallFormValues) => {
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    const newRow: BundleRow = {
      id: nextId,
      bundleType: "Call",
      totalAura: values.auraNeeded, // aura needed
      totalPrice: `${Number(values.time)} min`, // time label
      userPurchase: "0",
      createdOn: formatDate(new Date()),
      status: "Active",
    };
    setRows((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Edit open — pick modal based on bundleType
  const handleEdit = (row: BundleRow) => {
    setEditing(row);
    if (row.bundleType === "Aura") setEditAuraOpen(true);
    else setEditCallOpen(true);
  };

  // Edit submit (Aura)
  const handleUpdateAura = async (values: AuraFormValues) => {
    if (!editing) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              totalAura: String(Number(values.aura)),
              totalPrice: `$${Number(values.amount).toFixed(2)}`,
            }
          : r
      )
    );
    setEditAuraOpen(false);
    setEditing(null);
  };

  // Edit submit (Call)
  const handleUpdateCall = async (values: CallFormValues) => {
    if (!editing) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              totalAura: values.auraNeeded,
              totalPrice: `${Number(values.time)} min`,
            }
          : r
      )
    );
    setEditCallOpen(false);
    setEditing(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    setRows((rs) => rs.filter((r) => r.id !== id));
    setToggleStates((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    if (editing?.id === id) {
      setEditAuraOpen(false);
      setEditCallOpen(false);
      setEditing(null);
    }
  };

  // Prefill for editing forms
  const auraInitialValues = useMemo(() => {
    if (!editing || editing.bundleType !== "Aura") return undefined;
    // totalPrice like "$4.99" -> number
    const amount = editing.totalPrice.replace(/^\$/, "");
    return {
      aura: editing.totalAura,
      amount,
    };
  }, [editing]);

  const callInitialValues = useMemo(() => {
    if (!editing || editing.bundleType !== "Call") return undefined;
    // totalPrice like "10 min" -> "10"
    const time = editing.totalPrice.replace(/\s*min$/i, "");
    return {
      time,
      auraNeeded: editing.totalAura,
    };
  }, [editing]);

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filters */}
        <div className="flex gap-3">
          {/* Status filter */}
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

          {/* Bundle filter */}
          <Select
            value={bundleFilter}
            onValueChange={(v) => setBundleFilter(v as BundleFilter)}
          >
            <SelectTrigger className="w-40 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <SelectValue placeholder="Bundle Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Aura Bundle">Aura Bundle</SelectItem>
              <SelectItem value="Call Bundle">Call Bundle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add buttons */}
        <div className="flex gap-3">
          {/* Add Aura Bundle */}
          <AuraBundleDialog
            trigger={
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
                Add New Aura Bundle
              </Button>
            }
            onSubmit={handleAddAura}
            title="Add New Aura Bundle"
          />

          {/* Add Call Bundle */}
          <CallBundleDialog
            trigger={
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
                Add New Call Bundle
              </Button>
            }
            onSubmit={handleAddCall}
            title="Add New Call Bundle"
          />
        </div>
      </div>

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          bundles={currentBundles}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          headerNames={headerNames}
          onEdit={handleEdit}
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

      {/* EDIT dialogs (controlled) */}
      <AuraBundleDialog
        open={editAuraOpen}
        onOpenChange={setEditAuraOpen}
        initialValues={auraInitialValues}
        onSubmit={handleUpdateAura}
        title="Edit Aura Bundle"
      />

      <CallBundleDialog
        open={editCallOpen}
        onOpenChange={setEditCallOpen}
        initialValues={callInitialValues}
        onSubmit={handleUpdateCall}
        title="Edit Call Bundle"
      />
    </div>
  );
}
