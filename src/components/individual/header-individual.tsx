"use client";
import React from "react";
import { Menu, Bell, UserCircle } from "lucide-react";
import { useIndividualNavStore } from "@/app/(individual)/_store/individual-nav-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const HeaderIndividual: React.FC = () => {
  const { toggle } = useIndividualNavStore();
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = (path: string): string => {
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/integrations")) return "Integrations";
    if (path.startsWith("/userEvents")) return "My Events";
    if (path.startsWith("/event")) return "Events";
    if (path.startsWith("/settings")) return "Settings";
   
    return "My Dashboard"; 
  };
  
  const pageTitle = getPageTitle(pathname);

  return (
    // Increased navbar height to h-20 (5rem / 80px). Adjust if needed.
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 bg-blue-600 dark:bg-blue-700 px-4 md:px-6 shadow-md">
      {/* Left side: Burger Menu (mobile) and Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
         className="lg:hidden shrink-0 text-white dark:text-blue-100 hover:bg-blue-800 dark:hover:bg-blue-900 focus:ring-blue-600 p-2" 
          onClick={toggle}
          aria-label="Toggle navigation menu"
        >
          {/* Burger menu icon size can also be adjusted if needed, e.g., h-6 w-6 */}
          <Menu className="h-6 w-6" /> 
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold text-white dark:text-blue-100 hidden md:block"> {/* Slightly larger title for taller bar */}
          {pageTitle}
        </h1>
      </div>

      {/* Right side: Notification and User Icons */}
      <div className="flex items-center gap-3 md:gap-4"> {/* Increased gap slightly */}
        <Button 
          variant="ghost" 
          size="icon" // The 'icon' size for Button usually makes it square, padding adjusts around the icon
          className="rounded-full text-white dark:text-blue-100 hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-blue-500 p-2" // Added padding to button for larger click area
          aria-label="Notifications"
        >
          {/* Increased Bell icon size */}
          <Bell className="h-6 w-6 md:h-10 md:w-10" /> 
          <span className="sr-only">Toggle notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-white dark:text-blue-100 hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-blue-500 p-1" // Added padding to button
              aria-label="User menu"
            >
              {/* Increased UserCircle icon size */}
              <UserCircle className="h-7 w-7 md:h-8 md:w-8" /> 
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
            <DropdownMenuLabel className="text-slate-700 dark:text-slate-200">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-slate-200 dark:border-slate-700"/>
     
            <Link href="/settings" passHref legacyBehavior>
              <DropdownMenuItem className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 cursor-pointer">Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="border-slate-200 dark:border-slate-700"/>
            <DropdownMenuItem 
              className="text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-500 dark:hover:bg-red-600 focus:bg-red-500 dark:focus:bg-red-600 cursor-pointer"
              onClick={() => { router.push('/login'); }}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderIndividual;
