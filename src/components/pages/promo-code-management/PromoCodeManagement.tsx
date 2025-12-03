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
import CustomPagination from "@/components/share/CustomPagination";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmDialog from "@/components/share/ConfirmDialog";

type PromoRow = {
  id: string;
  promoCode: string;
  type: "Percentage" | "Flat";
  usageLimit: number;
  startISO: string;
  endISO: string;
  startTime: string;
  endTime: string;
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
  startTime: formatDateTime(promo.startDate),
  endTime: formatDateTime(promo.endDate),
  status: promo.isActive ? "Active" : "Inactive",
  value: promo.value,
  usedCount: promo.usedCount,
});

// Map form values to API payload
const mapFormToPayload = (values: PromoFormValues) => {
  const numericValue = parseFloat(values.value.replace(/[%৳]/g, "").trim());

  return {
    promoCode: values.promoCode.trim(),
    discountType:
      values.discountType === "Percentage"
        ? "Percentage Discount"
        : "Flat Discount",
    value: numericValue,
    usageLimit: Number(values.usageLimit),
    startDate: new Date(values.startDateTime).toISOString(),
    endDate: new Date(values.endDateTime).toISOString(),
  };
};

export function PromoCodeManagement() {
  const router = useRouter();
  const params = useSearchParams();
  const statusFilter = params.get("status") || "all";
  const currentPage = Number(params.get("page")) || 1;

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PromoRow | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    id: string;
    action: "delete" | "status";
  } | null>(null);

  const updateQuery = (key: string, value: string) => {
    const query = new URLSearchParams(params.toString());
    if (value && value !== "all") {
      query.set(key, value);
    } else {
      query.delete(key);
    }
    router.push(`?${query.toString()}`, { scroll: false });
  };

  const itemsPerPage = 2;
  const queryParams = [
    { name: "page", value: String(currentPage) },
    { name: "limit", value: String(itemsPerPage) },
  ];

  if (statusFilter !== "all") {
    queryParams.push({ name: "isActive", value: statusFilter });
  }

  // API hooks
  const { data: response, isLoading } = useGetAllPromoCodesQuery(queryParams);
  console.log(response);

  const [createPromo] = useCreatePromoCodeMutation();
  const [updatePromo] = useUpdatePromoCodeMutation();
  const [updateStatus] = useUpdatePromoCodeStatusMutation();
  const [deletePromo] = useDeletePromoCodeMutation();

  // Transform API data
  const promos = useMemo(() => {
    return response?.data?.map(mapPromoToRow) || [];
  }, [response?.data]);

  // Toggle states for UI
  const toggleStates = useMemo(() => {
    return promos.reduce((acc: Record<string, boolean>, promo: PromoRow) => {
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

  // const handleToggle = async (id: string) => {
  //   try {
  //     const promo = promos.find((p) => p.id === id);
  //     if (!promo) return;

  //     const newStatus = promo.status === "Active" ? "inactive" : "active";
  //     await updateStatus({ id, status: newStatus }).unwrap();
  //     toast.success("Status updated successfully!");
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to update status");
  //     console.error("Toggle error:", error);
  //   }
  // };
  const askStatusUpdate = (id: string) => {
    setConfirmData({ id, action: "status" });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmData) return;

    const { id, action } = confirmData;

    try {
      if (action === "delete") {
        await deletePromo(id).unwrap();
        toast.success("Promo code deleted!");
      }

      if (action === "status") {
        const promo = promos.find((p) => p.id === id);
        if (!promo) return;

        const newStatus = promo.status === "Active" ? "inactive" : "active";
        await updateStatus({ id, status: newStatus }).unwrap();
        toast.success("Status updated!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed");
    }

    setConfirmData(null);
  };

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Are you sure you want to delete this promo code?")) return;

  //   try {
  //     await deletePromo(id).unwrap();
  //     toast.success("Promo code deleted successfully!");
  //     if (editing?.id === id) {
  //       setEditOpen(false);
  //       setEditing(null);
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Failed to delete promo code");
  //     console.error("Delete error:", error);
  //   }
  // };

  const askDelete = (id: string) => {
    setConfirmData({ id, action: "delete" });
    setConfirmOpen(true);
  };

  const handleEdit = (row: PromoRow) => {
    setEditing(row);
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
          onValueChange={(v) => updateQuery("status", v)}
        >
          <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
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
            promos={promos}
            toggleStates={toggleStates}
            handleToggle={askStatusUpdate}
            headerNames={headerNames}
            onEdit={handleEdit}
            onDelete={askDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateQuery("page", String(page))}
              maxVisiblePages={5}
              scrollToTop={true}
            />
          )}
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        title={
          confirmData?.action === "delete" ? "Delete Promo?" : "Change Status?"
        }
        description={
          confirmData?.action === "delete"
            ? "Are you sure you want to delete this promo code?"
            : "Are you sure you want to change the status?"
        }
        confirmText={confirmData?.action === "delete" ? "Delete" : "Update"}
      />

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
