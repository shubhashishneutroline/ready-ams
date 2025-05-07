"use client";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu"; // Import the MenuIcon
import { useDispatch } from "react-redux";

import { setOpenSidebarTrue } from "@/state/admin/AdminSlice";
import { useAppSelector } from "@/state/store";

interface HeaderTitleProps {
  icon: React.ReactNode;
  pageTitle: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ icon, pageTitle }) => {
  const dispatch = useDispatch();
  const { isFlag } = useAppSelector((state) => state.admin.admin.sidebar.add);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect screen size on mount and on resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768); // Define "mobile" screen
  //   };

  //   handleResize(); // initial call
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // const handleClick = () => {
  //   if (isMobile) {
  //     console.log("clicked");
  //     dispatch(setOpenSidebarTrue(!isFlag)); // toggle on click for mobile
  //   }
  // };

  // const handleMouseEnter = () => {
  //   if (!isMobile) {
  //     dispatch(setOpenSidebarTrue(true)); // hover for desktop
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (!isMobile) {
  //     dispatch(setOpenSidebarTrue(false));
  //   }
  // };
  useEffect(() => {}, [isFlag]);
  return (
    <div className="flex  gap-1 sm:gap-2 lg:gap-3 justify-between items-center px-2">
      {icon}
      <span className="flex items-end text-[14px] sm:text-[18px] lg:text-[22px] text-white font-[600] leading-[30px] -tracking-[2%]">
        {pageTitle}
      </span>
      <div onClick={() => dispatch(setOpenSidebarTrue(!isFlag))}>
        <MenuIcon
          sx={{
            fontSize: {
              xs: "20px",
              sm: "23px",
              lg: "25px",
              xl: "30px",
            },
          }}
          className="text-white cursor-pointer"
        />
      </div>
    </div>
  );
};

export default HeaderTitle;
