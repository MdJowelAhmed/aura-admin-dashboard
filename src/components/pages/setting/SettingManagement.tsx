"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfilePage from "./ProfilePage";
import ChangePasswordForm from "./ChangePassword";


const SettingManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-4">
        <button
          onClick={() => handleTabChange("profile")}
          className={`px-4 py-2 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => handleTabChange("change-password")}
          className={`px-4 py-2 ${
            activeTab === "change-password"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "profile" && <ProfilePage />}
        {activeTab === "change-password" && <ChangePasswordForm />}
      </div>
    </div>
  );
};

export default SettingManagement;
