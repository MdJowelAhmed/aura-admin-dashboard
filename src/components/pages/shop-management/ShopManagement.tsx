// ShopManagement.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
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
import {
  useGetAllShopManagementQuery,
  useCreateShopManagementMutation,
  useUpdateShopManagementMutation,
  useUpdateShopManagementStatusMutation,
  useDeleteShopManagementMutation,
  type ShopManagement,
} from "@/lib/store/shopManagement/shopManagementApi";
import { toast } from "sonner"; // or your toast library

// Helpers
function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

type StatusFilter = "Status" | "Active" | "Block";
type BundleFilter = "All" | "Aura Bundle" | "Call Bundle";

// Convert API data to table row format
function mapApiDataToRow(item: ShopManagement): BundleRow {
  const isAura = item.bundleType === "aura";
  const isCall = item.bundleType === "call";

  return {
    id: item._id,
    bundleType: isAura ? "Aura" : "Call",
    totalAura: isAura
      ? String(item.auraBundle?.auraNumber || "0")
      : String(item.callBundle?.neededAura || "0"),
    totalPrice: isAura
      ? `${Number(item.auraBundle?.amount || 0).toFixed(2)}`
      : `${item.callBundle?.enterTime || 0} min`,
    userPurchase: "0", // Not provided in API, keeping as placeholder
    createdOn: formatDate(item.createdAt),
    status: item.status === "active" ? "Active" : "Block",
  };
}

export function ShopManagement() {
  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");
  const [bundleFilter, setBundleFilter] = useState<BundleFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Edit modal state
  const [editAuraOpen, setEditAuraOpen] = useState(false);
  const [editCallOpen, setEditCallOpen] = useState(false);
  const [editing, setEditing] = useState<BundleRow | null>(null);

  // API hooks
  const queryArgs = useMemo(() => {
    const args: Array<{ name: string; value: string }> = [
      { name: "page", value: String(currentPage) },
      { name: "limit", value: String(itemsPerPage) },
    ];
    
    if (statusFilter !== "Status") {
      args.push({
        name: "isActive",
        value: statusFilter === "Active" ? "true" : "false",
      });
    }
    
    if (bundleFilter !== "All") {
      args.push({
        name: "bundleType",
        value: bundleFilter === "Aura Bundle" ? "aura" : "call",
      });
    }
    
    return args;
  }, [currentPage, itemsPerPage, statusFilter, bundleFilter]);

  const { data, isLoading, refetch } = useGetAllShopManagementQuery(queryArgs);
  const [createBundle] = useCreateShopManagementMutation();
  const [updateBundle] = useUpdateShopManagementMutation();
  const [updateStatus] = useUpdateShopManagementStatusMutation();
  const [deleteBundle] = useDeleteShopManagementMutation();

  // Map API data to table rows
  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiDataToRow);
  }, [data]);

  // Toggle states from API data
  const toggleStates = useMemo(() => {
    if (!data?.data) return {};
    return data.data.reduce((acc, item) => {
      acc[item._id] = item.status === "active";
      return acc;
    }, {} as Record<string, boolean>);
  }, [data]);

  // Pagination from API
  const totalPages = data?.pagination?.totalPage || 1;

  const headerNames = [
    // "SL",
    "Total Aura",
    "Total Price",
    "User Purchase",
    // "Created On",
    "Status",
    "Action",
  ];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, bundleFilter]);

  // Handle toggle
  const handleToggle = async (id: string) => {
    try {
      const currentStatus = toggleStates[id];
      await updateStatus({
        id,
        status: currentStatus ? "block" : "active",
      }).unwrap();
      
      toast.success("Status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Toggle error:", error);
    }
  };

  // Add New Aura Bundle
  const handleAddAura = async (values: AuraFormValues) => {
    try {
      await createBundle({
        bundleType: "aura",
        auraBundle: {
          auraNumber: Number(values.aura),
          amount: Number(values.amount),
        },
        isActive: true,
      } as any).unwrap();
      
      toast.success("Aura bundle created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create aura bundle");
      console.error("Create error:", error);
    }
  };

  // Add New Call Bundle
  const handleAddCall = async (values: CallFormValues) => {
    try {
      await createBundle({
        bundleType: "call",
        callBundle: {
          enterTime: Number(values.time),
          neededAura: Number(values.auraNeeded),
        },
        isActive: true,
      } as any).unwrap();
      
      toast.success("Call bundle created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create call bundle");
      console.error("Create error:", error);
    }
  };

  // Edit open
  const handleEdit = (row: BundleRow) => {
    setEditing(row);
    if (row.bundleType === "Aura") setEditAuraOpen(true);
    else setEditCallOpen(true);
  };

  // Edit submit (Aura)
  const handleUpdateAura = async (values: AuraFormValues) => {
    if (!editing) return;
    
    try {
      await updateBundle({
        _id: editing.id,
        bundleType: "aura",
        auraBundle: {
          auraNumber: Number(values.aura),
          amount: Number(values.amount),
        },
      } as any).unwrap();
      
      toast.success("Aura bundle updated successfully");
      setEditAuraOpen(false);
      setEditing(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update aura bundle");
      console.error("Update error:", error);
    }
  };

  // Edit submit (Call)
  const handleUpdateCall = async (values: CallFormValues) => {
    if (!editing) return;
    
    try {
      await updateBundle({
        _id: editing.id,
        bundleType: "call",
        callBundle: {
          enterTime: Number(values.time),
          neededAura: Number(values.auraNeeded),
        },
      } as any).unwrap();
      
      toast.success("Call bundle updated successfully");
      setEditCallOpen(false);
      setEditing(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update call bundle");
      console.error("Update error:", error);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    
    try {
      await deleteBundle(id).unwrap();
      toast.success("Bundle deleted successfully");
      
      if (editing?.id === id) {
        setEditAuraOpen(false);
        setEditCallOpen(false);
        setEditing(null);
      }
      
      refetch();
    } catch (error) {
      toast.error("Failed to delete bundle");
      console.error("Delete error:", error);
    }
  };

  // Prefill for editing forms
  const auraInitialValues = useMemo(() => {
    if (!editing || editing.bundleType !== "Aura") return undefined;
    const amount = editing.totalPrice.replace(/^\$/, "");
    return {
      aura: editing.totalAura,
      amount,
    };
  }, [editing]);

  const callInitialValues = useMemo(() => {
    if (!editing || editing.bundleType !== "Call") return undefined;
    const time = editing.totalPrice.replace(/\s*min$/i, "");
    return {
      time,
      auraNeeded: editing.totalAura,
    };
  }, [editing]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto space-y-2 my-5">
        <div className="flex justify-center items-center py-20">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

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
              <SelectItem value="Block">Block</SelectItem>
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
          bundles={rows}
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