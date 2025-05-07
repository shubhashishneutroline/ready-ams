"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CenterSection from "@/features/shared-features/section/centersection";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useForm } from "react-hook-form";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  setAddAppointmentFormTrue,
  setAddNotificationFormTrue,
} from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";
import { retriveUsers } from "@/state/admin/AdminServices";
import AnnouncementForm from "../../forms/admin/notification/AnnouncementForm";
import Button from "@/features/shared-features/common/button";
import ReminderForm from "../../forms/admin/notification/NotificationForm";
import CustomerInfomationForm from "../../forms/admin/support/CustomerInformation";

import AdminSupportForm from "../../forms/admin/support/AdminSupportForm";
import CustomerSupportPage from "../../forms/admin/support/CustomerSupportPage";
import AddFAQ from "../../forms/admin/support/AddFAQ";
import {
  formSubTitleCss,
  formTitleCss,
  formTitleDivCss,
  pageContainerCss,
} from "@/features/shared-features/form/props";
import FAQPage from "../../forms/admin/support/FAQPage";
import AddBusinessAvailabilityForm from "./AddBusinessAvailabilityForm";
import BusinessSettingForm from "../../forms/admin/business-setting/BusinessSettingForm";
import StaffPage from "../../forms/admin/business-setting/StaffPage";
import AdminPage from "../../forms/admin/business-setting/AdminPage";

const BusinessDetailsPage = () => {
  const [supportType, setSupportType] = useState("Business Details");
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.businessDetails.add
  );

  const isOpen = true;
  //  Ref for closing modal on outside click
  const formRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Staff", value: "staff" },
  ];

  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.notification.view.response
  );

  useEffect(() => {
    dispatch(retriveUsers());
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector(
        '.MuiPickersPopper-root, [role="dialog"]'
      );
      const clickedInsideCalendar =
        popup?.contains(event.target as Node) ?? false;
      const clickedInsideForm =
        formRef.current?.contains(event.target as Node) ?? false;

      if (!clickedInsideForm && !clickedInsideCalendar) {
        dispatch(setAddNotificationFormTrue(false));
      }
    };
    if (isFlag) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFlag]);
  return (
    <AnimatePresence>
      {isFlag && (
        <motion.div
          ref={formRef}
          initial={{ y: 50, scale: 0.9 }}
          animate={{ y: 0, scale: [0.9, 1.02, 1] }}
          exit={{ y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`${pageContainerCss}`}
        >
          <div className={formTitleDivCss}>
            <div className={formTitleCss}>Business Deatils</div>
            <div className={formSubTitleCss}>
              Manage and send system notification to suers and staff.
            </div>
          </div>
          <div className="flex px-3 lg:px-18 ">
            <div className="flex gap-8 bg-[#287AFF] px-4  rounded-md h-[38px] items-center w-full">
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[100px] lg:w-[180px] sm:h-[24px] sm:w-[100px] lg:h-[34px] font-medium   text-[11px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Business Details"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Business Details")}
              >
                Business Details
              </button>
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[100px] lg:w-[120px] sm:h-[24px] sm:w-[100px] lg:h-[34px] font-medium   text-[11px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Staffs"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Staffs")}
              >
                Staff Members
              </button>
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[100px] lg:w-[160px] sm:h-[24px] sm:w-[100px] lg:h-[34px] font-medium   text-[11px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Admins"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Admins")}
              >
                Admin Members
              </button>
            </div>
          </div>
          <div className="pt-4  h-full overflow-y-auto scrollbar flex justify-center">
            {supportType === "Business Details" && <BusinessSettingForm />}
            {supportType === "Staffs" && <StaffPage />}
            {supportType === "Admins" && <AdminPage />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessDetailsPage;
