/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/lib/store/apiSlice/authSlice";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Password changed successfully");
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  const handlePasswordChange = (field: string, value: any) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
      
        <p className="text-white/60">
          Please enter your current password and choose a new secure password
        </p>
      </div>

      {/* Password Form Fields */}
      <div className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label
            htmlFor="currentPassword"
            className="text-white text-sm font-medium"
          >
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              handlePasswordChange("currentPassword", e.target.value)
            }
            placeholder="Enter your current password"
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
          {errors.currentPassword && (
            <p className="text-red-400 text-sm">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-white text-sm font-medium"
          >
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              handlePasswordChange("newPassword", e.target.value)
            }
            placeholder="Enter your new password (min 8 characters)"
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
          {errors.newPassword && (
            <p className="text-red-400 text-sm">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-white text-sm font-medium"
          >
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              handlePasswordChange("confirmPassword", e.target.value)
            }
            placeholder="Confirm your new password"
            className="h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/20"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

 
        

        {/* Save Password Button */}
        <Button
          onClick={handlePasswordSave}
          disabled={
            isLoading ||
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
          }
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-white/20 disabled:text-white/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Updating Password...
            </div>
          ) : (
            "Update Password"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;