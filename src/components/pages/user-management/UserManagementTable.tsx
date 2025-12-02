"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { UserTable } from "./UserTable";
import UserReportDialog from "@/components/modal/UserReportDialog";
// import UserProfileDialog from "@/components/modal/UserProfileDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
// import { useGetAllUsersQuery } from "@/redux/api/userManagementApi";
import { Loader2 } from "lucide-react";
import { useGetAllUsersQuery } from "@/lib/store/userManage/userManagementApi";
import CustomPagination from "@/components/share/CustomPagination";
import UserProfileDialog from "./UserProfileDialog";
import { useRouter, useSearchParams } from "next/navigation";

type StatusFilter = "Status" | "active" | "block";
type UserTypeFilter = "All" | "ADMIN" | "MODERATOR" | "USER";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: "active" | "block";
  profile: string;
  documentVerified: string[] | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  verified: boolean;
  createdAt: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

export function UserManagement() {
  // const [perPage,setPerPage]=useState(5);
  const itemsPerPage = 4;
  // const [currentPage, setCurrentPage] = useState(1);
  //   const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState<StatusFilter>("Status");
  // const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>("All");
  const router = useRouter();
const params = useSearchParams();

const search = params.get("search") || "";
const statusFilter = (params.get("status") as StatusFilter) || "Status";
const userTypeFilter = (params.get("role") as UserTypeFilter) || "All";
const currentPage = (params.get("page") || "1");


 const queryParams = [
  { name: "page", value: String(currentPage) },
  { name: "limit", value: String(itemsPerPage) }
];

if (search) queryParams.push({ name: "searchTerm", value: search });
if (statusFilter !== "Status") queryParams.push({ name: "status", value: statusFilter });
if (userTypeFilter !== "All") queryParams.push({ name: "role", value: userTypeFilter });

  const { data, isLoading, error } = useGetAllUsersQuery(queryParams);




  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMode, setReportMode] = useState<"view" | "edit">("view");
  const [reportUser, setReportUser] = useState<User | null>(null);

  // Profile modal
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const openReport = (user: User, mode: "view" | "edit") => {
    setReportUser(user);
    setReportMode(mode);
    setReportOpen(true);
  };

  const updateQuery = (key: string, value: string) => {
  const query = new URLSearchParams(params.toString());
  if (value) query.set(key, value);
  else query.delete(key);

  router.push(`?${query.toString()}`, { scroll: false });
};


  const openProfile = (user: User) => {
    setProfileUser(user);
    setProfileOpen(true);
  };

  // Derived filtered rows
  const filtered = useMemo(() => {
    if (!data?.data?.data) return [];

    const q = search.trim().toLowerCase();
    return data.data.data.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "Status" ? true : user.status === statusFilter;

      const matchesType =
        userTypeFilter === "All" ? true : user.role === userTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data, search, statusFilter, userTypeFilter]);

  // Pagination
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentUsers = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const currentUsers = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPage ;
  console.log(totalPages)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load users. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-2 my-5">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left: Search */}
        <div className="w-full sm:w-100">
          <Input
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => updateQuery("search", e.target.value)}
            className="bg-white/20 backdrop-blur-sm border border-white/50 text-white h-12"
          />
        </div>

        {/* Right: User Type + Status */}
        <div className="flex gap-3">
          {/* User Type */}
          <Select
            value={userTypeFilter}
            onValueChange={(v) => updateQuery("role", v as UserTypeFilter)}
          >
            <SelectTrigger className="w-40 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <SelectValue placeholder="User Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MODERATOR">Moderator</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={statusFilter}
            onValueChange={(v) => updateQuery("status", v as StatusFilter)}
          >
            <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl h-12 py-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-white" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="block">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col justify-end items-end">
        <UserTable
          users={currentUsers}
          onReportView={openReport}
          onViewProfile={openProfile}
          
        />

        {/* Pagination */}
        {totalPages > 1 && (
       
          <CustomPagination
            maxVisiblePages={5}
            totalPages={totalPages}
            currentPage={Number(currentPage)}
            onPageChange={(page) => updateQuery("page", page.toString())}
            
          />
        )}
      </div>

      {/* Modals */}
      <UserReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        mode={reportMode}
        user={
          reportUser && {
            id: reportUser._id,
            userName: `${reportUser.firstName} ${reportUser.lastName}`,
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