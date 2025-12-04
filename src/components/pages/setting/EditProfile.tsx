/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getImageUrl } from "@/components/share/imageUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/lib/store/apiSlice/authSlice";
import { Edit3, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ProfileEditForm = () => {
  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetMyProfileQuery();
  
  const [updateMyProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();

  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // Image state + refs
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  // Load profile data when available
  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      // Set existing profile image
      if (user.profile) {
        setProfileImageUrl(user.profile);
      }
    }
  }, [profileResponse]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    // Revoke old URL
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    const url = URL.createObjectURL(f);
    prevUrlRef.current = url;
    setProfileImageFile(f);
    setProfileImageUrl(url);
  };

  const clearImage = () => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setProfileImageFile(null);
    // Reset to original profile image if exists
    if (profileResponse?.data?.profile) {
      setProfileImageUrl(profileResponse.data.profile);
    } else {
      setProfileImageUrl(null);
    }
    // Clear input value
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProfileSave = async () => {
    try {
      const formData = new FormData();
      
     
      const profileUpdateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
      };
      if(profileUpdateData){
        formData.append("data", JSON.stringify(profileUpdateData));
      }
      
      // Add image if a new one was selected
      if (profileImageFile) {
        formData.append("image", profileImageFile);
      }
      console.log("formData", formData);
      const response = await updateMyProfile(formData).unwrap();
      console.log("response", response);
      
      if (response.success) {
        toast.success(response.message || "Profile updated successfully");
        // Clear the selected file after successful upload
        if (profileImageFile) {
          if (prevUrlRef.current) {
            URL.revokeObjectURL(prevUrlRef.current);
            prevUrlRef.current = null;
          }
          setProfileImageFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden">
            {profileImageUrl ? (
              <Image
                src={getImageUrl(profileImageUrl)}
                alt="Profile preview"
                height={100}
                width={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Edit button triggers file input */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Change profile photo"
          >
            <Edit3 className="w-4 h-4 text-slate-600" />
          </button>

          {/* Remove image button (visible when a new image is selected) */}
          {profileImageFile && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
              aria-label="Remove profile photo"
            >
              ×
            </button>
          )}

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-hidden="true"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p className="text-white/60">
            Click the edit icon to change your profile photo
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-white text-sm font-medium"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) =>
              handleProfileChange("firstName", e.target.value)
            }
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-white text-sm font-medium"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) =>
              handleProfileChange("lastName", e.target.value)
            }
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-white text-sm font-medium"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) =>
              handleProfileChange("email", e.target.value)
            }
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-white text-sm font-medium"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            value={profileData.phoneNumber}
            onChange={(e) =>
              handleProfileChange("phoneNumber", e.target.value)
            }
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleProfileSave}
          disabled={isUpdating}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Changes...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;