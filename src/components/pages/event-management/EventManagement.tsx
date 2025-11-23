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
import { Table } from "./EventTable";

import CreateEventDialog from "@/components/modal/CreateEventDialog";
import type { CreateEventFormValues } from "./CreateEventForm";

// Helpers
function displayToISO(s: string): string {
  // "DD-MM-YYYY hh:mm AM/PM" -> ISO
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

function isoToDatetimeLocal(iso: string): string {
  // Convert ISO (UTC or local) to local "YYYY-MM-DDTHH:MM"
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// Seed with state + optional imageUrl so edit can prefill them
const initialDisplayData = [
  {
    id: 1,
    eventName: "Aura Bundle Event",
    eventType: "Aura Bundle",
    startTime: "01-02-2025 10:00 AM",
    endTime: "01-02-2025 12:00 PM",
    status: "Active",
    state: "California",
    imageUrl: "/aura-logo.png",
  },
  {
    id: 2,
    eventName: "Call Bundle Event",
    eventType: "Call Bundle",
    startTime: "02-02-2025 11:00 AM",
    endTime: "02-02-2025 01:00 PM",
    status: "Active",
    state: "Texas",
    imageUrl: "/aura-logo.png",
  },
  {
    id: 3,
    eventName: "Premium Bundle Event",
    eventType: "Premium Bundle",
    startTime: "03-02-2025 12:00 PM",
    endTime: "03-02-2025 02:00 PM",
    status: "Inactive",
    state: "Florida",
    imageUrl: "/aura-logo.png",
  },
];

export type EventRow = {
  id: number;
  eventName: string;
  eventType: string; // display label
  startTimeISO: string;
  endTimeISO: string;
  status: "Active" | "Inactive";
  state: string;
  imageUrl?: string;
};

export function EventManagement() {
  const [statusFilter, setStatusFilter] = useState("Active");
  const [bundleFilter, setBundleFilter] = useState("Aura Bundle");

  const seeded = useMemo<EventRow[]>(
    () =>
      initialDisplayData.map((r) => ({
        id: r.id,
        eventName: r.eventName,
        eventType: r.eventType,
        startTimeISO: displayToISO(r.startTime),
        endTimeISO: displayToISO(r.endTime),
        status: r.status as "Active" | "Inactive",
        state: r.state,
        imageUrl: r.imageUrl,
      })),
    []
  );

  const [bundles, setBundles] = useState<EventRow[]>(seeded);

  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    seeded.reduce((acc, bundle) => {
      acc[bundle.id] = bundle.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // EDIT state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleToggle = (id: number) => {
    setToggleStates((prev) => {
      const next = !prev[id];
      setBundles((rows) =>
        rows.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...prev, [id]: next };
    });
  };

  // Pagination is handled directly in the UI components

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBundles = bundles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bundles.length / itemsPerPage);

  // Headers
  const headerNames = [
    "SL",
    "Event Name",
    "Event Type",
    "Start Time",
    "End Time",
    "Status",
    "Actions",
  ];

  // ADD submit
  const handleCreateEvent = async (values: CreateEventFormValues) => {
    const nextId = Math.max(0, ...bundles.map((b) => b.id)) + 1;
    const eventTypeLabel =
      values.eventType === "unlimited_ad_time"
        ? "Unlimited Ad Time"
        : values.eventType === "limited_slots"
        ? "Limited Slots"
        : values.eventType === "premium"
        ? "Premium Event"
        : values.eventType;

    const newRow: EventRow = {
      id: nextId,
      eventName: values.eventName,
      eventType: eventTypeLabel,
      startTimeISO: values.startDateTime, // already in datetime-local format; fine to store
      endTimeISO: values.endDateTime,
      status: "Active",
      state: values.state,
      imageUrl: "/aura-logo.png", // optional: set default or from upload response
    };

    setBundles((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Edit open
  const handleEditClick = (row: EventRow) => {
    setEditing(row);
    setEditOpen(true);
  };

  // Edit submit
  const handleUpdateEvent = async (values: CreateEventFormValues) => {
    if (!editing) return;
    const eventTypeLabel =
      values.eventType === "unlimited_ad_time"
        ? "Unlimited Ad Time"
        : values.eventType === "limited_slots"
        ? "Limited Slots"
        : values.eventType === "premium"
        ? "Premium Event"
        : values.eventType;

    setBundles((rows) =>
      rows.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              eventName: values.eventName,
              eventType: eventTypeLabel,
              startTimeISO: values.startDateTime,
              endTimeISO: values.endDateTime,
              state: values.state,
            }
          : r
      )
    );

    setEditOpen(false);
    setEditing(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    setBundles((rows) => rows.filter((r) => r.id !== id));
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

  // Prefill for edit
  const editInitialValues: Partial<CreateEventFormValues> | undefined = editing
    ? {
        eventName: editing.eventName,
        eventType:
          editing.eventType === "Unlimited Ad Time"
            ? "unlimited_ad_time"
            : editing.eventType === "Limited Slots"
            ? "limited_slots"
            : "premium",
        state: editing.state,
        startDateTime: isoToDatetimeLocal(editing.startTimeISO),
        endDateTime: isoToDatetimeLocal(editing.endTimeISO),
      }
    : undefined;

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-white" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={bundleFilter} onValueChange={setBundleFilter}>
          <SelectTrigger className="w-40 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-white" />
              <SelectValue placeholder="Event Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aura Bundle">Aura Bundle</SelectItem>
            <SelectItem value="Call Bundle">Call Bundle</SelectItem>
            <SelectItem value="Premium Bundle">Premium Bundle</SelectItem>
          </SelectContent>
        </Select>

        {/* ADD */}
        <CreateEventDialog
          trigger={
            <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
              Create New Event
            </Button>
          }
          onSubmit={handleCreateEvent}
        />
      </div>

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          bundles={currentBundles}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          headerNames={headerNames}
          onEdit={handleEditClick}
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
      <CreateEventDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
        onSubmit={handleUpdateEvent}
        // show existing image preview if you have it
        initialImageUrl={editing?.imageUrl}
      />
    </div>
  );
}
