// UserManagement.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Table, UserRow } from "./UserTable";
import UserReportDialog from "@/components/modal/UserReportDialog";
import UserProfileDialog from "@/components/modal/UserProfileDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

// Extend the table's UserRow locally to carry optional avatar/passport
type ExtendedUserRow = UserRow & {
  avatarUrl?: string;
  passportPhotoUrl?: string;
};

type StatusFilter = "Status" | "Active" | "Inactive";
type UserTypeFilter = "All" | "Admin" | "Moderator" | "User";

// Sample data matching new headers (+ userType used for filter) + passport photos
const usersData: ExtendedUserRow[] = [
  {
    id: 1,
    userName: "Mijanur Rahman",
    email: "mijan.connect@gmail.com",
    location: "Dhaka, BD",
    phoneNumber: "+8801711000000",
    joiningDate: "01-02-2025",
    report: "View",
    status: "Active",
    userType: "Admin",
    avatarUrl: "/avatars/mijan.png", // optional local avatar (static file)
    passportPhotoUrl: "/passports/mijan-passport.jpg", // <-- shown in profile modal
  },
  {
    id: 2,
    userName: "Arif Hossain",
    email: "arif@example.com",
    location: "Chattogram, BD",
    phoneNumber: "+8801811000000",
    joiningDate: "05-02-2025",
    report: "View",
    status: "Active",
    userType: "User",
    avatarUrl: "/avatars/arif.png",
    passportPhotoUrl: "/passports/arif-passport.jpg",
  },
  {
    id: 3,
    userName: "Nusrat Jahan",
    email: "nusrat@example.com",
    location: "Sylhet, BD",
    phoneNumber: "+8801911000000",
    joiningDate: "10-02-2025",
    report: "View",
    status: "Inactive",
    userType: "Moderator",
    avatarUrl: "/avatars/nusrat.png",
    passportPhotoUrl: "/passports/nusrat-passport.jpg",
  },
];

export function UserManagement() {
  // Table state (widened to ExtendedUserRow so we keep extra fields in TS too)
  const [rows, setRows] = useState<ExtendedUserRow[]>(usersData);

  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    usersData.reduce((acc, r) => {
      acc[r.id] = r.status === "Active";
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const headerNames = [
    "SL",
    "User Name",
    "Email",
    "Location",
    "Phone Number",
    "Joining Date",
    "Report",
    "Status",
    "Action",
  ];

  // Toggle Active/Inactive
  const handleToggle = (id: number) =>
    setToggleStates((p) => {
      const next = !p[id];
      setRows((rs) =>
        rs.map((r) =>
          r.id === id ? { ...r, status: next ? "Active" : "Inactive" } : r
        )
      );
      return { ...p, [id]: next };
    });

  // Delete
  const handleDelete = (id: number) => {
    setRows((rs) => rs.filter((r) => r.id !== id));
    setToggleStates((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Derived filtered rows (search + filters)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.userName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.phoneNumber.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "Status" ? true : r.status === statusFilter;
      const matchesType =
        userTypeFilter === "All"
          ? true
          : (r.userType ?? "User") === userTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rows, search, statusFilter, userTypeFilter]);

  // Pagination on filtered
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMode, setReportMode] = useState<"view" | "edit">("view");
  const [reportUser, setReportUser] = useState<UserRow | null>(null);

  const openReport = (row: UserRow, mode: "view" | "edit") => {
    setReportUser(row);
    setReportMode(mode);
    setReportOpen(true);
  };

  // Profile modal (store full extended row to carry passport/avatars)
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<ExtendedUserRow | null>(null);

  const openProfile = (row: UserRow) => {
    // row comes from Table (typed as UserRow) but it actually carries extra fields.
    // Find the full row from our state to ensure we include passport/avatars:
    const full = rows.find((r) => r.id === row.id) || (row as ExtendedUserRow);
    setProfileUser(full);
    setProfileOpen(true);
  };

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left: Search */}
        <div className="w-full sm:w-100">
          <Input
            placeholder="Search here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/20 backdrop-blur-sm border border-white/50 text-white h-12"
          />
        </div>

        {/* Right: User Type + Status */}
        <div className="flex gap-3">
          {/* User Type */}
          <Select
            value={userTypeFilter}
            onValueChange={(v) => setUserTypeFilter(v as UserTypeFilter)}
          >
            <SelectTrigger className="w-40 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <SelectValue placeholder="User Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">User Type</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Moderator">Moderator</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
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
      </div>

      {/* Table */}
      <div className="flex flex-col justify-end items-end">
        <Table
          rows={currentRows}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          headerNames={headerNames}
          onReportView={openReport}
          onViewProfile={openProfile}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`${
                currentPage === i + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-white/20 text-white"
              } rounded-lg px-4 py-2 hover:bg-cyan-400 transition-colors`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <UserReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        mode={reportMode}
        user={
          reportUser && {
            id: reportUser.id,
            userName: reportUser.userName,
            email: reportUser.email,
          }
        }
      />
      <UserProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={profileUser}
      />
    </div>
  );
}
