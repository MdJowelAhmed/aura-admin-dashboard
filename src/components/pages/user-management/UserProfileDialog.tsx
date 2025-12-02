import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { User } from "@/app/(Dashboard)/(users)/user-management/UserManagement";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { User } from "./UserManagementTable";
import { getImageUrl } from "@/components/share/imageUrl";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export default function UserProfileDialog({
  open,
  onOpenChange,
  user,
}: UserProfileDialogProps) {
  if (!user) return null;

  const getInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "N/A";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <Avatar className="h-20 w-20">
              <AvatarImage src={getImageUrl(user.profile)} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Contact Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
                {user.emailVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{user.phoneNumber || "Not provided"}</span>
                {user.phoneVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span>
                  {user.location?.coordinates[0] === 0 && user.location?.coordinates[1] === 0
                    ? "Not set"
                    : `Lat: ${user.location?.coordinates[1]}, Lng: ${user.location?.coordinates[0]}`}
                </span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Account Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Joined:</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Verified:</span>
                <span>{user.verified ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          {user.documentVerified && user.documentVerified.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Document Verification</h4>
              <div className="grid grid-cols-2 gap-4">
                {user.documentVerified.map((doc, idx) => (
                  <div key={idx} className="border rounded-lg p-2">
                    <Image
                      src={getImageUrl(doc)}
                      width={200}
                      height={100}
                      alt={`Document ${idx + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}