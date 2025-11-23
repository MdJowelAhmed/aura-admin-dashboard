"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { GoBellFill } from "react-icons/go";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import NotificationsModal, { NotificationItem } from "./NotificationsModal";

const routeToTitleMap: Record<string, string> = {
  "analytics-reports": "ANALYTICS & REPORTS",
  "video-call-settings": "VIDEO CALL SETTINGS",
  "aura-package": "AURA PACKAGE",
  "community-guidelines": "COMMUNITY GUIDELINES",
  dashboard: "DASHBOARD",
  "event-management": "EVENT MANAGEMENT",
  "game-management": "GAME MANAGEMENT",
  "promo-code-management": "PROMO CODE MANAGEMENT",
  "push-notification": "PUSH NOTIFICATION",
  settings: "SETTINGS",
  "shop-management": "SHOP MANAGEMENT",
  "users-management": "USERS MANAGEMENT",
};

import { logout as logoutAction } from "@/lib/store/authSlice/authSlice";
import { useDispatch } from "react-redux";

const Header = ({
  setActiveTabShow,
  activeTabShow,
  showButtons = true,
  title = "ANALYTICS & REPORTS",
  onLogout, // optional callback
}: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentTab = pathname.split("/")[1] || "dashboard";

  // Modals
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Example notifications (replace with your data source)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "Payment received",
      description: "Invoice #AUR-1029 has been paid.",
      time: "2 min ago",
      read: false,
    },
    {
      id: "n2",
      title: "New user signup",
      description: "Rakib Hasan just joined.",
      time: "10 min ago",
      read: false,
    },
    {
      id: "n3",
      title: "Server status",
      description: "US-East latency back to normal.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  // Title
  const dynamicTitle = routeToTitleMap[currentTab] || title;

  const handleTabChange = (tab: string) => setActiveTabShow(tab);

  const getButtonStyles = (tabName: string) => {
    const isActive = activeTabShow === tabName;
    return `px-4 py-6 rounded-lg text-gray-50 transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-[#00bcd4] hover:bg-[#00acc1] text-white border-none shadow-md"
        : "border-gray-400 hover:bg-gray-400 bg-transparent border hover:border-gray-400 "
    }`;
  };

  const goSettings = () => router.push("/settings");

  const handleLogoutClick = () => {
    setLogoutOpen(true);
    // Close dropdown behind the scenes
    setTimeout(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }, 0);
  };

  const confirmLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }
    // dispatch logout action which clears tokens from storage & state
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const openNotifications = () => setNotifOpen(true);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 pb-6 border-b-1 border-white/80">
        <div className="flex items-center space-x-4 px-6">
          <h2 className="text-4xl text-white  font-[Bebas_Neue]">
            {dynamicTitle}
          </h2>
          {showButtons && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleTabChange("revenue")}
                className={getButtonStyles("revenue")}
                variant={activeTabShow === "revenue" ? "default" : "outline"}
              >
                Revenue & Monetization
              </Button>
              <Button
                onClick={() => handleTabChange("engagement")}
                className={getButtonStyles("engagement")}
                variant={activeTabShow === "engagement" ? "default" : "outline"}
              >
                Engagement & App Usage
              </Button>
              <Button
                onClick={() => handleTabChange("server-load")}
                className={getButtonStyles("server-load")}
                variant={
                  activeTabShow === "server-load" ? "default" : "outline"
                }
              >
                Real-time Server Load
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 px-6">
          <span className="text-gray-50">Hello, Mijan</span>

          {/* Avatar dropdown (Settings / Log Out) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10 border rounded-full cursor-pointer">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="text-gray-800">M</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goSettings}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutClick}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification icon triggers full "See All" modal */}
          <div
            className="flex items-center border p-1 rounded-full cursor-pointer"
            onClick={openNotifications}
            role="button"
            aria-label="See all notifications"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openNotifications()}
          >
            <GoBellFill className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmLogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />

      <NotificationsModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllAsRead}
        onItemClick={(id) => markOneAsRead(id)}
      />
    </>
  );
};

export default Header;
