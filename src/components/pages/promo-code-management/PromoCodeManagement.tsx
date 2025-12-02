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
import { useState, useMemo } from "react";
import { Table } from "./PromoTable";
import type { PromoFormValues } from "./PromoForm";
import PromoDialog from "@/components/modal/PromoDialog";
import {
  useGetAllPromoCodesQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeMutation,
  useUpdatePromoCodeStatusMutation,
  useDeletePromoCodeMutation,
  type Promo,
} from "@/lib/store/promoCode/promoCode";
import { toast } from "sonner";

type StatusFilter = "Status" | "Active" | "Inactive";

type PromoRow = {
  id: string;
  promoCode: string;
  type: "Percentage" | "Flat";
  usageLimit: number;
  startISO: string;
  endISO: string;
  status: "Active" | "Inactive";
  value: number;
  usedCount: number;
};

// Format ISO date for display
const formatDateTime = (iso: string): string => {
  return new Date(iso).toLocaleString();
};

// Map API response to table row format
const mapPromoToRow = (promo: Promo): PromoRow => ({
  id: promo._id,
  promoCode: promo.promoCode,
  type: promo.discountType.includes("Percentage") ? "Percentage" : "Flat",
  usageLimit: promo.usageLimit,
  startISO: promo.startDate,
  endISO: promo.endDate,
  status: promo.isActive ? "Active" : "Inactive",
  value: promo.value,
  usedCount: promo.usedCount,
});

// Map form values to API payload
const mapFormToPayload = (values: PromoFormValues) => {
  const numericValue = parseFloat(values.value.replace(/[%৳]/g, "").trim());
  
  return {
    promoCode: values.promoCode.trim(),
    discountType: values.discountType === "Percentage" 
      ? "Percentage Discount" 
      : "Flat Discount",
    value: numericValue,
    usageLimit: Number(values.usageLimit),
    startDate: new Date(values.startDateTime).toISOString(),
    endDate: new Date(values.endDateTime).toISOString(),
  };
};

export function PromoCodeManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PromoRow | null>(null);

  const itemsPerPage = 10;

  // API hooks
  const { data: response, isLoading } = useGetAllPromoCodesQuery([
    { name: "page", value: String(currentPage) },
    { name: "limit", value: String(itemsPerPage) },
  ]);

  const [createPromo] = useCreatePromoCodeMutation();
  const [updatePromo] = useUpdatePromoCodeMutation();
  const [updateStatus] = useUpdatePromoCodeStatusMutation();
  const [deletePromo] = useDeletePromoCodeMutation();

  // Transform API data
  const promos = useMemo(() => {
    return response?.data?.map(mapPromoToRow) || [];
  }, [response?.data]);

  // Filter by status
  const filteredPromos = useMemo(() => {
    if (statusFilter === "Status") return promos;
    return promos.filter((p) => p.status === statusFilter);
  }, [promos, statusFilter]);

  // Toggle states for UI
  const toggleStates = useMemo(() => {
    return promos.reduce((acc, promo) => {
      acc[promo.id] = promo.status === "Active";
      return acc;
    }, {} as Record<string, boolean>);
  }, [promos]);

  const totalPages = response?.pagination?.totalPage || 1;

  // Handlers
  const handleCreate = async (values: PromoFormValues) => {
    try {
      const payload = mapFormToPayload(values);
      await createPromo(payload as any).unwrap();
      toast.success("Promo code created successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create promo code");
      console.error("Create error:", error);
    }
  };

  const handleUpdate = async (values: PromoFormValues) => {
    if (!editing) return;

    try {
      const payload = { _id: editing.id, ...mapFormToPayload(values) };
      await updatePromo(payload as any).unwrap();
      toast.success("Promo code updated successfully!");
      setEditOpen(false);
      setEditing(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update promo code");
      console.error("Update error:", error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const promo = promos.find((p) => p.id === id);
      if (!promo) return;

      const newStatus = promo.status === "Active" ? "inactive" : "active";
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Status updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
      console.error("Toggle error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;

    try {
      await deletePromo(id).unwrap();
      toast.success("Promo code deleted successfully!");
      if (editing?.id === id) {
        setEditOpen(false);
        setEditing(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete promo code");
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (row: any) => {
    setEditing(row as PromoRow);
    setEditOpen(true);
  };

  // Prepare edit form initial values
  const editInitialValues: Partial<PromoFormValues> | undefined = editing
    ? {
        promoCode: editing.promoCode,
        discountType: editing.type,
        value: String(editing.value),
        usageLimit: String(editing.usageLimit),
        startDateTime: editing.startISO.slice(0, 16),
        endDateTime: editing.endISO.slice(0, 16),
      }
    : undefined;

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

  return (
    <div className="w-full mx-auto space-y-4 my-5">
      {/* Header Controls */}
      <div className="flex justify-end gap-3">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Status">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Create Button */}
        <PromoDialog
          trigger={
            <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30">
              Create New Promo
            </Button>
          }
          onSubmit={handleCreate}
          title="Create Promo"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-white py-8">Loading...</div>
      ) : (
        <div className="flex flex-col items-end">
          <Table
            promos={filteredPromos.map((p) => ({
              ...p,
              id: p.id as any,
              startTime: formatDateTime(p.startISO),
              endTime: formatDateTime(p.endISO),
            }))}
            toggleStates={toggleStates}
            handleToggle={handleToggle}
            headerNames={headerNames}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${
                    currentPage === i + 1
                      ? "bg-cyan-500 text-white"
                      : "bg-white/20 text-white"
                  } rounded-lg px-4 py-2 hover:bg-cyan-400`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <PromoDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
        onSubmit={handleUpdate}
        title="Edit Promo"
      />
    </div>
  );
}