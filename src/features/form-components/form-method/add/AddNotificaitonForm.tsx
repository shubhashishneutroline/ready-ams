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
import { retriveService, retriveUsers } from "@/state/admin/AdminServices";
import AnnouncementForm from "../../forms/admin/notification/AnnouncementForm";
import Button from "@/features/shared-features/common/button";
import ReminderForm from "../../forms/admin/notification/NotificationForm";
import {
  formContainerCss,
  formSubTitleCss,
  formTitleCss,
  formTitleDivCss,
} from "@/features/shared-features/form/props";

const AddNotificationForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.notification.add
  );

  const [notificationType, setNotificationType] = useState("Reminder");

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
  const { details: serviceDetails } = useAppSelector(
    (state: RootState) => state.admin.admin.service.view.response
  );

  function getServiceOptions(
    services: { id: string; title: string; status: string }[]
  ) {
    return services
      .filter((service) => service.status === "ACTIVE")
      .map((service) => ({
        label: service.title,
        value: service.id,
      }));
  }
  const serviceOptions = getServiceOptions(serviceDetails);

  useEffect(() => {
    // dispatch(retriveUsers());
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
        <CenterSection>
          <motion.div
            ref={formRef}
            initial={{ y: 50, scale: 0.9 }}
            animate={{ y: 0, scale: [0.9, 1.02, 1] }}
            exit={{ y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={formContainerCss}
          >
            <div className={formTitleDivCss}>
              <div className={formTitleCss}>Notification and Reminder</div>
              <div className={formSubTitleCss}>
                Manage System Notification and Reminder here.
              </div>
            </div>
            <div className="flex flex-col gap-1 px-16">
              <div className="flex w-full justify-start gap-2">
                <Button
                  css={{
                    customCss: `flex gap-2 justify-center items-center h-[30px] w-[100px] lg:w-[170px] sm:h-[34px] sm:w-[120px] lg:h-[32px] font-medium   text-[12px] sm:text-[14px] lg:text-[16px] rounded-md cursor-pointer ${
                      notificationType === "Reminder"
                        ? " bg-[#0070FF] text-white"
                        : "bg-gray-100 border-[1px] border-gray-300 text-black/60 hover:bg-gray-200"
                    }`,
                  }}
                  title="Reminder"
                  handleAction={() => setNotificationType("Reminder")}
                />
                <Button
                  css={{
                    customCss: `flex gap-2 justify-center items-center h-[30px] w-[100px] lg:w-[170px] sm:h-[34px] sm:w-[120px] lg:h-[32px] font-medium   text-[12px] sm:text-[14px] lg:text-[16px] rounded-md cursor-pointer ${
                      notificationType === "Announcement"
                        ? " bg-[#0070FF] text-white"
                        : "bg-gray-100 border-[1px] border-gray-300 text-black/60 hover:bg-gray-200"
                    }`,
                  }}
                  title="Announcement"
                  handleAction={() => setNotificationType("Announcement")}
                />
              </div>
              <div className="text-[#667085] text-[12px] font-[400] px-6">
                View and Manage your Reminder and Anncouncement Schedule here.
              </div>
            </div>
            <div className=" w-full overflow-y-auto scrollbar">
              {notificationType === "Reminder" && (
                <ReminderForm serviceOptions={serviceOptions} />
              )}
              {notificationType === "Announcement" && <AnnouncementForm />}
            </div>
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddNotificationForm;
