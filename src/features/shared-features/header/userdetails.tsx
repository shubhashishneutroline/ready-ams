import { useUser } from "@clerk/nextjs";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import Image from "next/image";
import React from "react";

const UserDetails = () => {
  const { user } = useUser();

  if (!user) return null;

  // Custom claims (example: "role")
  const updatedUserName = user.fullName || user.username || "User";
  const updatedRole = (user.publicMetadata?.role as string) || "Member";
  const userImage = user.imageUrl;
  return (
    <div className="flex items-center gap-3">
      <Image
        className="rounded-2xl w-12 md:w-14 lg:w-16"
        src={userImage}
        alt={updatedUserName}
        width={60}
        height={60}
      />
      <div className="gap-2 items-center hidden md:flex">
        <div className="flex flex-col text-white justify-center">
          <div className="text-[16px] font-medium text-center leading-[24px]">
            {updatedUserName}
          </div>
          <div className="text-[14px] font-normal text-center leading-[20px]">
            <span>{updatedRole}</span>
          </div>
        </div>
        <KeyboardArrowDownRounded
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
      </div>
    </div>
  );
};

export default UserDetails;
