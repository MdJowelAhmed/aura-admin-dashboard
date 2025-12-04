"use client";
import { useState } from "react";
// import ProfileEditForm from "./ProfileEditForm";
import ChangePasswordForm from "./ChangePassword";
import ProfileEditForm from "./EditProfile";
// import ChangePasswordForm from "./ChangePasswordForm";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"edit-profile" | "change-password">("edit-profile");

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex gap-8 mb-8">
            <button
              onClick={() => setActiveTab("edit-profile")}
              className={`text-xl font-medium transition-colors duration-200 ${
                activeTab === "edit-profile"
                  ? "text-white border-b-2 border-white pb-2"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("change-password")}
              className={`text-xl font-medium transition-colors duration-200 ${
                activeTab === "change-password"
                  ? "text-white border-b-2 border-white pb-2"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "edit-profile" ? (
            <ProfileEditForm />
          ) : (
            <ChangePasswordForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;