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
import { useState } from "react";
import { Table } from "./EventTable";
import { useRouter, useSearchParams } from "next/navigation";
import CreateEventDialog from "@/components/modal/CreateEventDialog";
import type { CreateEventFormValues } from "./CreateEventForm";
import {
  useGetAllEventManagementQuery,
  useCreateEventManagementMutation,
  useUpdateEventManagementMutation,
  useUpdateEventManagementStatusMutation,
  useDeleteEventManagementMutation,
} from "@/lib/store/eventManagement/eventManagementApi";
import { toast } from "sonner";
import CustomPagination from "@/components/share/CustomPagination";

export type EventRow = {
  _id: string;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  state: string;
  selectedGame: string;
  image?: string | null;
};

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function EventManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filters from URL
  const statusFilter = searchParams.get("status") || "all";
  const bundleFilter = searchParams.get("eventType") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = 5;

  // Build query args
  const queryArgs = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: itemsPerPage.toString() },
  ];

  if (statusFilter !== "all") {
    queryArgs.push({
      name: "isActive",
      value: statusFilter === "Active" ? "true" : "false",
    });
  }

  if (bundleFilter !== "all") {
    queryArgs.push({ name: "eventType", value: bundleFilter });
  }

  // API Hooks
  const {
    data: eventData,
    isLoading,
    refetch,
  } = useGetAllEventManagementQuery(queryArgs);
  const [createEvent] = useCreateEventManagementMutation();
  const [updateEvent] = useUpdateEventManagementMutation();
  const [toggleEventStatus] = useUpdateEventManagementStatusMutation();
  const [deleteEvent] = useDeleteEventManagementMutation();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null);

  // Update URL when filters change
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "all" || value === "1") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusFilterChange = (value: string) => {
    updateURL({ status: value, page: "1" });
  };

  const handleBundleFilterChange = (value: string) => {
    updateURL({ eventType: value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  // Toggle event status
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleEventStatus({
        id,
        status: currentStatus ? "inactive" : "active",
      }).unwrap();
      toast.success("Event status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update event status");
      console.error(error);
    }
  };

  // UNIFIED SAVE FUNCTION (Create or Update)
  const handleSaveEvent = async (values: CreateEventFormValues) => {
    const isEditing = !!editingEvent;

    try {
      const formData = new FormData();

      // Prepare event data
      const eventData = {
        eventName: values.eventName,
        eventType: values.eventType,
        state: values.state,
        startDate: new Date(values.startDateTime).toISOString(),
        endDate: new Date(values.endDateTime).toISOString(),
        selectedGame: values.selectedGame || "kd",
      };

      formData.append("data", JSON.stringify(eventData));

      // Append new image if provided
      if (values.thumbnail) {
        formData.append("image", values.thumbnail);
      }

      // Call appropriate API
      if (isEditing) {
        // Debug: Check if ID exists
        if (!editingEvent?._id) {
          toast.error("Event ID is missing");
          console.error("Editing event:", editingEvent);
          return;
        }

        console.log("Updating event with ID:", editingEvent._id);

        await updateEvent({
          id: editingEvent._id,
          formData: formData,
        } as any).unwrap();
        toast.success("Event updated successfully");
      } else {
        await createEvent(formData as any).unwrap();
        toast.success("Event created successfully");
      }

      // Close dialog and reset state
      setDialogOpen(false);
      setEditingEvent(null);
      refetch();
    } catch (error: any) {
      const action = isEditing ? "update" : "create";
      toast.error(error?.data?.message || `Failed to ${action} event`);
      console.error(error);
    }
  };

  // Open dialog for creating new event
  const handleCreateClick = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  // Open dialog for editing existing event
  const handleEditClick = (row: EventRow) => {
    setEditingEvent(row);
    setDialogOpen(true);
  };

  // DELETE EVENT
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id).unwrap();
      toast.success("Event deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete event");
      console.error(error);
    }
  };

  // Map API data to EventRow
  const bundles: EventRow[] = eventData?.data || [];
  const toggleStates: Record<string, boolean> =
    bundles.reduce((acc, bundle) => {
      acc[bundle._id] = bundle.isActive;
      return acc;
    }, {} as Record<string, boolean>) || {};

  const totalPages = eventData?.pagination?.totalPage || 1;

  const headerNames = [
    "SL",
    "Event Name",
    "Event Type",
    "Start Date",
    "End Date",
    "Status",
    "Actions",
  ];

  // Prepare initial values for dialog (empty for create, populated for edit)
  const dialogInitialValues: Partial<CreateEventFormValues> | undefined =
    editingEvent
      ? {
          eventName: editingEvent.eventName,
          eventType: editingEvent.eventType,
          state: editingEvent.state,
          startDateTime: isoToDatetimeLocal(editingEvent.startDate),
          endDateTime: isoToDatetimeLocal(editingEvent.endDate),
          selectedGame: editingEvent.selectedGame || "kd",
        }
      : undefined;

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-end">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-white" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={bundleFilter} onValueChange={handleBundleFilterChange}>
          <SelectTrigger className="w-40 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-white" />
              <SelectValue placeholder="Event Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Unlimited Ad Time">Unlimited Ad Time</SelectItem>
            <SelectItem value="Unlimited Games">Unlimited Games</SelectItem>
            <SelectItem value="Unlimited Select City">
              Unlimited Select City
            </SelectItem>
            <SelectItem value="Off APshop">Off APshop</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleCreateClick}
          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200"
        >
          Create New Event
        </Button>
      </div>

      <div className="flex flex-col justify-end items-end">
        {isLoading ? (
          <div className="text-center text-white py-8">Loading events...</div>
        ) : (
          <>
            <Table
              bundles={bundles}
              toggleStates={toggleStates}
              handleToggle={handleToggle}
              headerNames={headerNames}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {/* {totalPages > 1 && (
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
            )} */}
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* UNIFIED Dialog for Create and Edit */}
      <CreateEventDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        initialValues={dialogInitialValues}
        onSubmit={handleSaveEvent}
        initialImageUrl={editingEvent?.image || undefined}
      />
    </div>
  );
}
