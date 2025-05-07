"use client";
import { capitalizeFirstChar } from "@/utils/utils";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Image from "next/image";
import { motion } from "framer-motion";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import UserDetails from "./userdetails";

const UserProfile = () => {
  return (
    <div className="flex items-center gap-4">
      {/* <Image
        className="rounded-2xl w-13 md:w-14 lg:w-16 xl:w-16"
        src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
        alt="Musfiq"
        width={60}
        height={60}
      />
      <div className=" gap-2 items-center hidden md:flex">
        <div className="flex flex-col text-white justify-center">
          <div className="text-[16px] font-medium text-center leading-[24px]">
            {updatedUserName}
          </div>
          <div className="text-[14px] font-normal text-center leading-[20px]">
            {updatedRole}
          </div>
        </div>
        <KeyboardArrowDownRoundedIcon
          className="text-white"
          sx={{
            fontSize: {
              sm: "23px",
              lg: "25px",
              xl: "30px",
            },
            padding: "0px",
          }}
        />
      </div> */}
      <SignedOut>
        <div className="flex flex-col sm:flex-row gap-2 items-center-center">
          <SignInButton>
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0px 0px 12px rgba(0, 112, 255, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex gap-2 justify-center items-center w-[70px] h-[26px] sm:w-[80px] sm:h-[36px] lg:h-[45px] lg:w-[100px] bg-[#0070FF] font-medium text-white text-[12px] sm:text-[14px] lg:text-[17px] rounded-sm sm:rounded-lg cursor-pointer border border-white"
            >
              Sign In
            </motion.button>
          </SignInButton>
          <SignUpButton>
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0px 0px 12px rgba(0, 112, 255, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex gap-2 justify-center items-center w-[70px] h-[26px] sm:w-[80px] sm:h-[36px] lg:h-[45px] lg:w-[100px] bg-green-500 font-medium text-white text-[12px] sm:text-[14px] lg:text-[17px] rounded-sm sm:rounded-lg cursor-pointer border border-black"
            >
              Sign Up
            </motion.button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserDetails />
        </UserButton>
      </SignedIn>
    </div>
  );
};

export default UserProfile;
