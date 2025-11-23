"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Table, PackageRow } from "./PackageTable";
import type { PackageFormValues } from "./PackageForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import PackageDialog from "@/components/modal/PackageDialog";

// Helpers
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

type StatusFilter = "Status" | "Active" | "Inactive";

// Sample data to match the new columns
const packageData: PackageRow[] = [
  {
    id: 1,
    packageName: "Starter Aura",
    duration: "7 days",
    price: "$4.99",
    userPurchase: "2000",
    createdOn: "01-02-2025",
    status: "Active",
  },
  {
    id: 2,
    packageName: "Pro Aura",
    duration: "30 days",
    price: "$9.99",
    userPurchase: "950",
    createdOn: "02-02-2025",
    status: "Active",
  },
  {
    id: 3,
    packageName: "Premium Aura",
    duration: "90 days",
    price: "$19.99",
    userPurchase: "120",
    createdOn: "03-02-2025",
    status: "Inactive",
  },
];

export function AuraPackage() {
  const [rows, setRows] = useState<PackageRow[]>(packageData);

  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    packageData.reduce((acc, row) => {
      acc[row.id] = row.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Status filter (default "Status" shows all)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRow | null>(null);

  const handleToggle = (id: number) =>
    setToggleStates((prev) => {
      const next = !prev[id];
      setRows((rs) =>
        rs.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...prev, [id]: next };
    });

  // Apply filter BEFORE pagination
  const filtered = rows.filter((r) =>
    statusFilter === "Status" ? true : r.status === statusFilter
  );

  // Pagination on filtered
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const headerNames = [
    "SL",
    "Package Name",
    "Duration",
    "Price",
    "User Purchase",
    "Created On",
    "Status",
    "Action",
  ];

  // Create
  const handleCreatePackage = async (values: PackageFormValues) => {
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    const newRow: PackageRow = {
      id: nextId,
      packageName: values.packageName,
      duration: values.duration,
      price: `$${Number(values.price).toFixed(2)}`,
      userPurchase: "0",
      createdOn: formatDate(new Date()),
      status: "Active",
    };
    setRows((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Edit open
  const handleEdit = (row: PackageRow) => {
    setEditing(row);
    setEditOpen(true);
  };

  // Update
  const handleUpdatePackage = async (values: PackageFormValues) => {
    if (!editing) return;
    setRows((rs) =>
      rs.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              packageName: values.packageName,
              duration: values.duration,
              price: `$${Number(values.price).toFixed(2)}`,
            }
          : r
      )
    );
    setEditOpen(false);
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
      setEditOpen(false);
      setEditing(null);
    }
  };

  // Prefill for edit dialog
  const editInitialValues = useMemo(() => {
    if (!editing) return undefined;
    return {
      packageName: editing.packageName,
      duration: editing.duration as PackageFormValues["duration"],
      price: editing.price.replace(/^\$/, ""),
    } as Partial<PackageFormValues>;
  }, [editing]);

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        {/* Filters */}
        <div className="flex gap-3">
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
        </div>

        {/* Create New Package */}
        <div className="flex gap-3">
          <PackageDialog
            trigger={
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
                Create New Package
              </Button>
            }
            onSubmit={handleCreatePackage}
            title="Create New Package"
          />
        </div>
      </div>

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          rows={currentRows}
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

      {/* EDIT (controlled) */}
      <PackageDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
        onSubmit={handleUpdatePackage}
        title="Edit Package"
      />
    </div>
  );
}
