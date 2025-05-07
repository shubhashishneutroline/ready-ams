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

const SupportAndFaqPage = () => {
  const [supportType, setSupportType] = useState("Customer Information");
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.support.add
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
  }, [isFlag, supportType]);
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
            <div className={formTitleCss}>Support and Help</div>
            <div className={formSubTitleCss}>
              Manage and send system notification to suers and staff.
            </div>
          </div>
          <div className="flex-1 lg:px-18">
            <div className="flex gap-8 bg-[#287AFF] px-4 rounded-md h-[38px] items-center ">
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[170px] lg:w-[180px] sm:h-[24px] sm:w-[80px] lg:h-[34px] font-medium   text-[10px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Customer Information"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Customer Information")}
              >
                Customer Information
              </button>
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[60px] lg:w-[120px] sm:h-[24px] sm:w-[80px] lg:h-[34px] font-medium   text-[12px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "FAQs"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("FAQs")}
              >
                FAQs
              </button>
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[60px] lg:w-[160px] sm:h-[24px] sm:w-[80px] lg:h-[34px] font-medium   text-[12px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Customer Support"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Customer Support")}
              >
                Customer Support
              </button>
              <button
                className={`flex gap-2 justify-center items-center h-[20px] w-[60px] lg:w-[160px] sm:h-[24px] sm:w-[80px] lg:h-[34px] font-medium   text-[12px] sm:text-[12px] lg:text-[13px] rounded-md cursor-pointer ${
                  supportType === "Admin Support"
                    ? "bg-white text-black"
                    : "bg-[#287AFF] text-white"
                }`}
                type="button"
                onClick={() => setSupportType("Admin Support")}
              >
                Admin Support
              </button>
            </div>
          </div>
          <div className="pt-4  h-full overflow-y-auto scrollbar flex justify-center">
            {supportType === "Customer Information" && (
              <CustomerInfomationForm />
            )}
            {supportType === "FAQs" && <FAQPage />}
            {supportType === "Customer Support" && <CustomerSupportPage />}
            {supportType === "Admin Support" && <AdminSupportForm />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportAndFaqPage;
