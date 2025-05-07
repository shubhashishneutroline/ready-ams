"use client";
import React, { useEffect, useState } from "react";

import Sidebar, { SideBarProps } from "./sidebar";
import MobileSidebar from "./mobilesidebar";
import { RootState, useAppSelector } from "@/state/store";

const ResponsiveSidebar = (props: SideBarProps) => {
  const { title, menus } = props;
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.sidebar.add
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize); // Listen for changes

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileSidebar title={title} menus={menus} />
      ) : (
        <Sidebar title={title} menus={menus} />
      )}
    </>
  );
  // isFlag && <MobileSidebar title={title} menus={menus} />
};

export default ResponsiveSidebar;
