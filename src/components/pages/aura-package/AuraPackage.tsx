"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  useGetAllShopPackagesQuery,
  useCreateShopPackageMutation,
  useUpdateShopPackageMutation,
  useUpdateShopPackageStatusMutation,
  useDeleteShopPackageMutation,
} from "@/lib/store/auraShopPackage/auraShopPackageApi";

type StatusFilter = "Status" | "Active" | "Inactive";

// Helper to format API date to DD-MM-YYYY
function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function AuraPackage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get values from URL or set defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const statusFilter = (searchParams.get("status") as StatusFilter) || "Status";
  const itemsPerPage = 5;

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRow | null>(null);

  // Update URL parameters
  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "Status") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Build API query params
  const apiQueryParams = useMemo(() => {
    const params = [
      { name: "page", value: String(currentPage) },
      { name: "limit", value: String(itemsPerPage) },
    ];
    
    if (statusFilter !== "Status") {
      params.push({ 
        name: "isActive", 
        value: statusFilter === "Active" ? "true" : "false" 
      });
    }
    
    return params;
  }, [currentPage, statusFilter, itemsPerPage]);

  // RTK Query hooks
  const { data: apiResponse, isLoading } = useGetAllShopPackagesQuery(apiQueryParams);

  const [createPackage] = useCreateShopPackageMutation();
  const [updatePackage] = useUpdateShopPackageMutation();
  const [updateStatus] = useUpdateShopPackageStatusMutation();
  const [deletePackage] = useDeleteShopPackageMutation();

  // Transform API data to table rows
  const allRows: PackageRow[] = useMemo(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data.map((pkg) => ({
      id: pkg._id,
      packageName: pkg.title,
      duration: pkg.duration,
      description: pkg.description,
      price: `$${pkg.price.toFixed(2)}`,
      userPurchase: String(pkg.totalUsers || 0),
      createdOn: formatDate(pkg.createdAt),
      status: pkg.isActive ? "Active" : "Inactive",
    }));
  }, [apiResponse]);

  // Pagination
  const totalPages = apiResponse?.totalPage || 1;

  const headerNames = [
    "SL",
    "Package Name",
    "Duration",
    "Description",
    "Price",
    "User Purchase",
    // "Created On",
    "Status",
    "Action",
  ];

  // Handler to change page
  const handlePageChange = (page: number) => {
    updateURL({ page: String(page), status: statusFilter });
  };

  // Handler to change status filter
  const handleStatusFilterChange = (status: StatusFilter) => {
    updateURL({ page: "1", status: status });
  };

  // Create handler
  const handleCreatePackage = async (values: PackageFormValues) => {
    await createPackage({
      title: values.packageName,
      description: "Package description",
      price: Number(values.price),
      duration: values.duration,
    } as any);
  };

  // Edit handler
  const handleEdit = (row: PackageRow) => {
    setEditing(row);
    setEditOpen(true);
  };

  // Update handler
  const handleUpdatePackage = async (values: PackageFormValues) => {
    if (!editing) return;
    await updatePackage({
      _id: editing.id,
      title: values.packageName,
      description: "Package description",
      price: Number(values.price),
      duration: values.duration,
    } as any);
    setEditOpen(false);
    setEditing(null);
  };

  // Toggle status handler
  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active";
    await updateStatus({ id, status: String(!newStatus) });
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      await deletePackage(id);
      if (editing?.id === id) {
        setEditOpen(false);
        setEditing(null);
      }
    }
  };

  // Edit initial values
  const editInitialValues = useMemo(() => {
    if (!editing) return undefined;
    return {
      packageName: editing.packageName,
      duration: editing.duration as PackageFormValues["duration"],
      price: editing.price.replace(/^\$/, ""),
      description: editing.description,
    } as Partial<PackageFormValues>;
  }, [editing]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto space-y-2 my-5 flex justify-center items-center min-h-[400px]">
        <p className="text-white text-lg">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={handleStatusFilterChange}
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

        {/* Create Package */}
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

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          rows={allRows}
          headerNames={headerNames}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
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

      {/* Edit Dialog */}
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