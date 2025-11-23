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
import { Table } from "./GameTable";
import type { GameFormValues } from "./GameForm";
import GameDialog from "@/components/modal/GameDialog";

// Format createdOn as "DD-MM-YYYY"
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Sample game data
const initialGames = [
  {
    id: 1,
    image: "/aura-logo.png",
    gameTitle: "Aura Bundle Event",
    description: "An exciting game with Aura bundles.",
    createdOn: "01-02-2025",
    status: "Active" as const,
  },
  {
    id: 2,
    image: "/aura-logo.png",
    gameTitle: "Call Bundle Event",
    description: "A thrilling Call bundle event.",
    createdOn: "02-02-2025",
    status: "Active" as const,
  },
  {
    id: 3,
    image: "/aura-logo.png",
    gameTitle: "Premium Bundle Event",
    description: "Premium bundles with exclusive features.",
    createdOn: "03-02-2025",
    status: "Inactive" as const,
  },
];

export type GameRow = {
  id: number;
  image: string;
  gameTitle: string;
  description: string;
  createdOn: string; // DD-MM-YYYY
  status: "Active" | "Inactive";
};

type StatusFilter = "Status" | "Active" | "Inactive"; // "Status" = show all

export function GameManagement() {
  const [games, setGames] = useState<GameRow[]>(initialGames);

  // Default "Status" means show all
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");

  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    initialGames.reduce((acc, g) => {
      acc[g.id] = g.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // EDIT state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<GameRow | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleToggle = (id: number) => {
    setToggleStates((prev) => {
      const next = !prev[id];
      setGames((rows) =>
        rows.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...prev, [id]: next };
    });
  };

  // const handlePagination = (page: number) => setCurrentPage(page);

  // Apply status filter BEFORE pagination
  const filteredGames =
    statusFilter === "Status"
      ? games
      : games.filter((g) => g.status === statusFilter);

  // Derived pagination (on filtered set)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = filteredGames.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage) || 1;

  // Headers
  const headerNames = [
    "SL",
    "Image",
    "Game Title",
    "Description",
    "Created On",
    "Status",
    "Actions",
  ];

  // ADD submit
  const handleCreateGame = async (values: GameFormValues) => {
    const nextId = Math.max(0, ...games.map((g) => g.id)) + 1;

    let imageUrl = "/aura-logo.png";
    if (values.thumbnail) {
      imageUrl = URL.createObjectURL(values.thumbnail);
    }

    const newRow: GameRow = {
      id: nextId,
      image: imageUrl,
      gameTitle: values.gameTitle,
      description: values.description,
      createdOn: formatDate(new Date()), // auto date
      status: "Active", // default Active
    };

    setGames((prev) => [newRow, ...prev]);
    setToggleStates((prev) => ({ ...prev, [nextId]: true }));
  };

  // Edit open
  const handleEditClick = (row: GameRow) => {
    setEditing(row);
    setEditOpen(true);
  };

  // Edit submit
  const handleUpdateGame = async (values: GameFormValues) => {
    if (!editing) return;

    setGames((rows) =>
      rows.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              gameTitle: values.gameTitle,
              description: values.description,
              image: values.thumbnail
                ? URL.createObjectURL(values.thumbnail)
                : r.image,
            }
          : r
      )
    );

    setEditOpen(false);
    setEditing(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    setGames((rows) => rows.filter((r) => r.id !== id));
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
  const editInitialValues: Partial<GameFormValues> | undefined = editing
    ? {
        gameTitle: editing.gameTitle,
        description: editing.description,
        // thumbnail can't be prefilled; we show current image via initialImageUrl
      }
    : undefined;

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Header Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
        <div className="flex gap-3">
          {/* Status select — default "Status" shows all */}
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

          {/* Add Game modal trigger */}
          <GameDialog
            trigger={
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 px-6 hover:bg-white/30 transition-all duration-200">
                Create New Game
              </Button>
            }
            onSubmit={handleCreateGame}
            title="Add Game"
          />
        </div>
      </div>

      <div className="flex flex-col justify-end items-end">
        {/* Table */}
        <Table
          bundles={currentGames}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          headerNames={headerNames}
          onEdit={(row) => handleEditClick(row as GameRow)}
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
      <GameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={editInitialValues}
        initialImageUrl={editing?.image}
        onSubmit={handleUpdateGame}
        title="Edit Game"
      />
    </div>
  );
}
