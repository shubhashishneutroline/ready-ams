"use client";
import React, { ReactEventHandler } from "react";
import Button from "@/features/shared-features/common/button";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import {
  setAddAdminResourceTrue,
  setAddStaffResourceTrue,
  setAddTicketFormTrue,
} from "@/state/admin/AdminSlice";

const AdminPageHeader = () => {
  const dispatch = useDispatch();

  const handleButtonClick = (e: ReactEventHandler) => {
    dispatch(setAddAdminResourceTrue(true));
  };

  return (
    <div className=" flex justify-between max-w-full lg:max-w-[calc(100vw-120px)] ">
      {/* Page Header Title */}
      <div className=" flex flex-col">
        <div className=" flex gap-4 items-center">
          <div className="font-semibold text-md  md:text-xl lg:text-2xl">
            Admin Resource
          </div>
          <div className="flex items-center px-2 h-[18px] lg:h-[25px] bg-blue-50 text-blue-400 text-[11px] lg:text-[14px] rounded-xl">
            Today
          </div>
        </div>
        <div className="text-[#667085] text-[11px] lg:text-[13px] sm:text-[12px] md:text-[13px] lg:text-[15px] tracking-wide">
          View and Manage Your Admin here..
        </div>
      </div>

      {/* Page Header View and Post Form*/}

      {/* <div className="flex flex-col gap-2 sm:flex-row lg:gap-4 justify-between items-center">
        <div className="flex items-center">
          <Button
            css={{
              customCss:
                "flex gap-2 justify-center items-center h-[30px] w-[100px] lg:w-[170px] sm:h-[34px] sm:w-[130px] lg:h-[38px] bg-[#0070FF] font-medium text-white  text-[12px] sm:text-[14px] lg:text-[16px] rounded-md cursor-pointer",
            }}
            title="Add Admin"
            icon={
              <AddIcon
                className="text-white"
                sx={{
                  fontSize: {
                    xs: "17px",
                    sm: "20px",
                    lg: "22px",
                    xl: "24px",
                  },
                }}
              />
            }
            handleAction={handleButtonClick}
          />
        </div>
      </div> */}
    </div>
  );
};

export default AdminPageHeader;
