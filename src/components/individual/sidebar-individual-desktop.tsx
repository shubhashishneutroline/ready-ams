"use client";
import React, { useState } from "react";
import { User, Video, Calendar, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface NavLinkItem {
  name: string;
  path: string;
  icon: React.ReactElement;
  action?: () => void;
}

const SidebarIndividualDesktop: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login"); 
  };

  const primaryNavLinks: NavLinkItem[] = [
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Integrations", path: "/integrations", icon: <Video size={20} /> }, // Name changed to Integrations
    { name: "Events", path: "event", icon: <Calendar size={20} /> },
    { name: "My Events", path: "/userEvents", icon: <Calendar size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const secondaryNavLinks: NavLinkItem[] = [
    { name: "Logout", path: "/login", icon: <LogOut size={20} />, action: handleLogout },
  ];

  return (
    <aside
      className={cn(
        `transition-all duration-300 ease-in-out flex flex-col justify-between shadow-xl bg-white dark:bg-slate-800 rounded-xl py-6 px-3 h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] border border-slate-200 dark:border-slate-700`,
        isSidebarCollapsed ? "w-[70px]" : "w-[240px]"
      )}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div>
        <div  className="flex items-center gap-3 mb-8 px-1">
          <div className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold flex items-center justify-center text-lg shadow-md">
            I
          </div>
          <span
            className={cn(
              "whitespace-nowrap text-xl font-semibold text-blue-700 dark:text-blue-400 transition-opacity duration-300", // Changed to blue
              isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
            style={{ overflow: "hidden", transitionProperty: "opacity, width" }}
          >
            My Dashboard
          </span>
        </div>

        <nav className="space-y-1.5">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={cn(
                "group flex items-center gap-3 p-2.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-75", // Hover and focus to blue
                pathname.startsWith(link.path) && "bg-blue-100 dark:bg-blue-700/60 text-blue-700 dark:text-blue-200 font-semibold shadow-sm" // Active state to blue
              )}
            >
              <span className={cn("flex-shrink-0", pathname.startsWith(link.path) ? "text-blue-600 dark:text-blue-300" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>{link.icon}</span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm transition-opacity duration-300",
                  isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}
                style={{ overflow: "hidden", transitionProperty: "opacity, width" }}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
        <nav className="space-y-1.5">
          {secondaryNavLinks.map((link) =>
            link.action ? (
              <div
                key={link.name}
                role="button"
                tabIndex={0}
                onClick={link.action}
                onKeyDown={(e) => e.key === 'Enter' && link.action && link.action()}
                className={cn(
                  "group flex items-center gap-3 p-2.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-75"
                )}
              >
                 <span className="flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400">{link.icon}</span>
                <span
                  className={cn(
                    "whitespace-nowrap text-sm transition-opacity duration-300",
                    isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  )}
                  style={{ overflow: "hidden", transitionProperty: "opacity, width" }}
                >
                  {link.name}
                </span>
              </div>
            ) : null 
          )}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarIndividualDesktop;
