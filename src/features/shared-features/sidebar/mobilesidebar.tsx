"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { RootState, useAppSelector } from "@/state/store";
import { useDispatch } from "react-redux";
import { setOpenSidebarTrue } from "@/state/admin/AdminSlice";

export interface SidebarMenusProps {
  menu: string;
  icon: React.ReactNode;
  path: string;
}
export interface SideBarProps {
  title: string;
  menus: SidebarMenusProps[];
}

const sidebarVariants = {
  hidden: {
    x: -100,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};
const MobileSidebar = (props: SideBarProps) => {
  const { title, menus } = props;
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.sidebar.add
  );
  const pathname = usePathname();

  // Outside click detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        dispatch(setOpenSidebarTrue(false)); // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);
  return (
    <motion.div
      className="absolute top-[2px] left-[2px] h-[calc(100vh)] lg:h-[calc(100vh-20px)] max-w-[230px] sm:max-w-[250px] bg-[#FFFFFF] text-gray-600 rounded-[24px] shadow-lg px-8 py-8 flex flex-col z-[10] items-center"
      initial="hidden"
      animate={isFlag ? "visible" : "hidden"}
      variants={sidebarVariants}
      ref={sidebarRef}
    >
      <div className="text-black font-bold text-[20px] md:text-[23px] leading-[150%] ">
        {title}
      </div>
      <div className="flex flex-col gap-6 sm:gap-9  mt-20 items-center">
        {menus?.map((menu: SidebarMenusProps, index: number) => {
          const isActive = pathname === menu.path;
          return (
            <nav
              className="flex justify-start w-[220px] ml-[20px] lg:ml-0"
              key={index}
            >
              <Link
                href={menu.path}
                className={`flex items-center gap-2 lg:gap-3 font-semibold ${
                  isActive ? "text-[#287AFF]" : " text-gray-500"
                } hover:text-[#287AFF]`}
              >
                {menu.icon}
                <span className="text-[13px] sm:text-[14px] lg:text-xl">
                  {menu.menu}
                </span>
              </Link>
            </nav>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MobileSidebar;
