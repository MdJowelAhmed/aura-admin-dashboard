import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
// import { User } from "./UserManagement";
// import { useUpdateUserStatusMutation } from "@/redux/api/userManagementApi";
import { toast } from "sonner";
import { useState } from "react";
import { useUpdateUserStatusMutation } from "@/lib/store/userManage/userManagementApi";
import { User } from "./UserManagementTable";

interface UserTableProps {
  users: User[];
  onReportView: (user: User, mode: "view" | "edit") => void;
  onViewProfile: (user: User) => void;
}

export function UserTable({ users, onReportView, onViewProfile }: UserTableProps) {
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleToggle = async (user: User) => {
    const newStatus = user.status === "active" ? "block" : "active";
    
    setLoadingStates(prev => ({ ...prev, [user._id]: true }));
    
    try {
      await updateUserStatus({
        id: user._id,
        status: newStatus,
      }).unwrap();
      
      toast.success(`User ${newStatus === "active" ? "activated" : "blocked"} successfully`);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user._id]: false }));
    }
  };

  const handleDelete = () => {
    // Implement delete functionality
    toast.info("Delete functionality to be implemented");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd-MM-yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/30 hover:bg-white/10">
              <TableHead className="text-white font-semibold">SL</TableHead>
              <TableHead className="text-white font-semibold">User Name</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Phone Number</TableHead>
              <TableHead className="text-white font-semibold">Joining Date</TableHead>
              <TableHead className="text-white font-semibold">Report</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-white">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user._id}
                  className="bg-white/90 backdrop-blur-sm border-b border-white/20 hover:bg-white/95 transition-all duration-200"
                >
                  <TableCell className="text-[#100F0E] font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-[#100F0E] font-medium">
                    {user?.firstName} {user?.lastName}
                  </TableCell>
                  <TableCell className="text-[#100F0E]">
                    {user?.email}
                  </TableCell>
                  <TableCell className="text-[#100F0E]">
                    {user?.location?.coordinates[0] === 0 && user?.location?.coordinates[1] === 0
                      ? "Not set"
                      : `${user?.location?.coordinates[1]}, ${user?.location?.coordinates[0]}`}
                  </TableCell>
                  <TableCell className="text-[#100F0E]">
                    {user?.phoneNumber || "N/A"}
                  </TableCell>
                  <TableCell className="text-[#100F0E]">
                    {formatDate(user?.createdAt || "")}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="h-7 px-3 bg-white/20 text-[#100F0E] border border-cyan-500 hover:bg-white/30"
                      onClick={() => onReportView(user, "view")}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2 w-[125px] mx-auto border border-cyan-500 rounded-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProfile(user)}
                        className="w-8 h-8 p-0 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <button
                        onClick={() => handleToggle(user)}
                        disabled={loadingStates[user._id]}
                        className={`relative inline-flex h-4 w-10 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                          user.status === "active" ? "bg-cyan-500" : "bg-gray-300"
                        }`}
                        aria-label={`Toggle status for ${user.firstName}`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            user.status === "active" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}