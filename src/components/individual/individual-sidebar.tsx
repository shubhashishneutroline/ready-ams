"use client";
import React, { useState } from "react";
import {
  User,
  Calendar,
  Video,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const IndividualSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setCollapsed] = useState(false);

  const handleNavClick = (link: string) => {
    router.push(link);
  };

  const navLinks = [
    { name: "Profile", path: "/profile", icon: <User /> },
    {
      name: "Video Integrations",
      path: "/integrations",
      icon: <Video />,
    },
    { name: "Events", path: "/event", icon: <Calendar /> },
    { name: "My Events", path: "/userEvents", icon: <Calendar /> },
  ];

  const secondaryLinks = [
    { name: "Settings", path: "/individual/settings", icon: <Settings /> },
    { name: "Logout", path: "/logout", icon: <LogOut /> },
  ];

  return (
    <>
      <aside
        className={cn(
          `transition-all duration-300 flex flex-col justify-between shadow bg-white rounded-xl py-6 px-4 h-[calc(100vh-3rem)]`,
          isSidebarCollapsed ? "w-[80px]" : "w-[250px]"
        )}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* Top - Profile Info */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                IN
              </div>
              <span
                className={`whitespace-nowrap text-xl font-semibold transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
                style={{
                  overflow: "hidden",
                  transitionProperty: "opacity, width",
                }}
              >
                My Dashboard
              </span>
            </div>
            {!isSidebarCollapsed && (
              <button onClick={() => setCollapsed(true)}>
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {isSidebarCollapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="absolute -right-3 top-10 bg-white rounded-full shadow p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Main Menu Items */}
          <div className="space-y-2">
            {navLinks.map((link, index) => (
              <div
                key={index}
                className={cn(
                  "group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-700 cursor-pointer transition-all duration-200",
                  pathname === link.path && "bg-indigo-50 text-indigo-700"
                )}
                onClick={() => handleNavClick(link.path)}
              >
                <span className="">{link.icon}</span>
                <span
                  className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                  style={{
                    overflow: "hidden",
                    transitionProperty: "opacity, width",
                  }}
                >
                  {link.name}
                </span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t my-4" />

          {/* Secondary Links */}
          <div className="space-y-2">
            {secondaryLinks.map((link, index) => (
              <div
                key={index}
                className={cn(
                  "group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-700 cursor-pointer transition-all duration-200",
                  pathname === link.path && "bg-gray-50 text-indigo-700"
                )}
                onClick={() => handleNavClick(link.path)}
              >
                <span>{link.icon}</span>
                <span
                  className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                  style={{
                    overflow: "hidden",
                    transitionProperty: "opacity, width",
                  }}
                >
                  {link.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: User Profile */}
        <div className="flex items-center justify-between mt-10 border-t p-3 pl-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              JD
            </div>
            <div
              className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
              style={{
                overflow: "hidden",
                transitionProperty: "opacity, width",
              }}
            >
              <div className="text-sm font-semibold">John Doe</div>
              <div className="text-xs text-muted-foreground">Individual</div>
            </div>
          </div>
          {!isSidebarCollapsed && (
            <Settings
              className="w-5 h-5 text-gray-700 cursor-pointer hover:text-indigo-700"
              onClick={() => handleNavClick("/individual/settings")}
            />
          )}
        </div>
      </aside>
    </>
  );
};

export default IndividualSidebar;
