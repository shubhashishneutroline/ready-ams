"use client";
import { motion } from "framer-motion";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CountryFlag from "./countryflag";
import HeaderSearch from "./headersearch";
import HeaderTitle from "./headertitle";
import UserProfile from "./userprofile";
import { RootState, useAppSelector } from "@/state/store";
import { useEffect, useState } from "react";

interface HeaderProps {
  icon: React.ReactNode;
  pageTitle: string;
}

const headerVariants = {
  expanded: {
    marginLeft: "0px",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  compressed: {
    marginLeft: "85px",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const Header = (props: HeaderProps) => {
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.sidebar.add
  );
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // lg breakpoint in Tailwind
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className="relative h-[80px] lg:min-h-[376px] bg-[#287AFF] rounded-b-[12px] w-full"
      initial={false}
      animate={isFlag ? "compressed" : "expanded"}
    >
      <motion.div
        className=" flex flex-col absolute top-2 md:top-3 lg:top-4 w-full px-2  md:px-4  right-0 lg:max-w-[calc(100vw-100px)] xl:pl-2 xl:pr-12"
        initial={false}
        // animate={{
        //   maxWidth: isSmallScreen
        //     ? isFlag
        //       ? "calc(100vw - 85px)"
        //       : "100vw"
        //     : "calc(100vw-325px)",
        // }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        variants={headerVariants}
      >
        <div className="flex h-[60px] w-full items-center justify-between">
          <HeaderTitle
            icon={
              <HomeRoundedIcon
                sx={{
                  fontSize: {
                    xs: "20px",
                    sm: "23px",
                    lg: "28px",
                    xl: "30px",
                  },
                }}
                className="text-white"
              />
            }
            pageTitle={"Dashboard"}
          />
          <div className="flex gap-6 items-center">
            <HeaderSearch />
            <CountryFlag countryCode="US" />
            <div className="flex gap-4 items-center">
              <div className="relative flex items-center justify-center h-[25px] w-[25px] sm:h-[30px] sm:w-[30px] lg:h-[35px] lg:w-[35px] 2xl:h-[45px] 2xl:w-[45px] bg-white rounded-[20%]">
                <div className="absolute bg-red-400 lg:h-2 lg:w-2 h-[6px] w-[6px] top-1 right-1 2xl:top-2 2xl:right-2 rounded-full" />
                <NotificationsNoneOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: "20px",
                      sm: "23px",
                      lg: "28px",
                      xl: "30px",
                    },
                  }}
                  className="text-[#FFA412]"
                />
              </div>
              <UserProfile />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;
