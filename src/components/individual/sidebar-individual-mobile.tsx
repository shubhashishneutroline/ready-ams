"use client";
import React from "react";
import { User, Video, Calendar, Settings, LogOut, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useIndividualNavStore } from "@/app/(individual)/_store/individual-nav-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkItem {
  name: string;
  path: string;
  icon: React.ReactElement;
  action?: () => void;
}

const SidebarIndividualMobile: React.FC = () => {
  const { isOpen, onClose } = useIndividualNavStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    onClose(); 
    router.push("/login"); 
  };

  const primaryNavLinks: NavLinkItem[] = [
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
    { name: "Integrations", path: "/integrations", icon: <Video size={22} /> }, // Name changed
    { name: "Events", path: "/event", icon: <Calendar size={22} /> },
    { name: "My Events", path: "/userEvents", icon: <Calendar size={22} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={22} /> },
  ];

  const secondaryNavLinks: NavLinkItem[] = [
    { name: "Logout", path: "/login", icon: <LogOut size={22} />, action: handleLogout },
  ];

  const handleLinkClick = (action?: () => void) => {
    if (action) {
      action(); 
    } else {
      onClose(); 
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          `lg:hidden fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out transform`,
          isOpen ? "translate-x-0" : "-translate-x-full",
          `w-[280px] h-full overflow-y-auto flex flex-col justify-between shadow-xl bg-white dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700`
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
            <Link href="/individual" className="flex items-center gap-3" onClick={() => handleLinkClick()}>
              <div className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold flex items-center justify-center text-lg shadow-md">
                I
              </div>
              <span id="mobile-menu-title" className="whitespace-nowrap text-lg font-semibold text-blue-700 dark:text-blue-400"> {/* Blue text */}
                My Dashboard
              </span>
            </Link>
            <button onClick={onClose} className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300" aria-label="Close menu"> {/* Blue hover for close */}
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "group flex items-center gap-3.5 py-2.5 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-75", // Blue hover/focus
                  pathname.startsWith(link.path) && "bg-blue-100 dark:bg-blue-700/60 text-blue-700 dark:text-blue-200 font-medium" // Blue active
                )}
                onClick={() => handleLinkClick()}
              >
                <span className={cn("flex-shrink-0", pathname.startsWith(link.path) ? "text-blue-600 dark:text-blue-300" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>{link.icon}</span>
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-6">
          <nav className="space-y-2">
            {secondaryNavLinks.map((link) =>
              link.action ? (
                <div
                  key={link.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleLinkClick(link.action)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLinkClick(link.action)}
                  className={cn(
                    "group flex items-center gap-3.5 py-2.5 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-75"
                  )}
                >
                  <span className="flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400">{link.icon}</span>
                  <span className="text-sm">{link.name}</span>
                </div>
              ) : null
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarIndividualMobile;
