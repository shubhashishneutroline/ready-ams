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
const Sidebar = (props: SideBarProps) => {
  const { title, menus } = props;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.sidebar.add
  );
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
    <>
      {!isFlag ? (
        <div className="absolute  left-[10px] h-screen h-[calc(100vh-20px)] max-w-[80px] bg-[#FFFFFF] text-gray-600 rounded-[24px] shadow-lg px-8  flex flex-col gap-2  z-[10] pt-40 ">
          <div className="flex flex-col gap-12 mt-[-10px] items-center ">
            {menus?.map((menu: SidebarMenusProps, index: number) => {
              const isActive = pathname === menu.path;
              return (
                <nav className="flex  justify-start  " key={index}>
                  <Link
                    href={menu.path}
                    className={`flex items-center gap-2 lg:gap-3 font-semibold ${
                      isActive ? "text-[#287AFF]" : " text-gray-500"
                    } hover:text-[#287AFF]`}
                  >
                    {menu.icon}
                  </Link>
                </nav>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div
          className="absolute top-[2px] left-[2px] lg:h-[calc(100vh-20px)] lg:max-w-[300px] bg-[#FFFFFF] text-gray-600 rounded-[24px] shadow-lg px-8 py-8 flex flex-col z-[10] items-center"
          initial="hidden"
          animate={isFlag ? "visible" : "hidden"}
          variants={sidebarVariants}
          ref={sidebarRef}
        >
          <div className="text-black font-bold text-[25px] leading-[150%] ">
            {title}
          </div>
          <div className="flex flex-col gap-12  mt-20 items-center">
            {menus?.map((menu: SidebarMenusProps, index: number) => {
              const isActive = pathname === menu.path;
              return (
                <nav
                  className="flex  justify-start w-[250px] ml-[20px] lg:ml-0 "
                  key={index}
                >
                  <Link
                    href={menu.path}
                    className={`flex items-center gap-3 font-semibold ${
                      isActive ? "text-[#287AFF]" : " text-gray-500"
                    } hover:text-[#287AFF]`}
                  >
                    {menu.icon}
                    <span className="text-[13px] lg:text-[16px]">
                      {menu.menu}
                    </span>
                  </Link>
                </nav>
              );
            })}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
