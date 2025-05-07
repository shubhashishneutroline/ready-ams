"use client";

import {
  addTicketBtnProps,
  addUserBtnProps,
  commonActions,
  fullNameProps,
} from "@/features/shared-features/form/formporps";

import { useForm } from "react-hook-form";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { motion, AnimatePresence } from "framer-motion";
import CenterSection from "@/features/shared-features/section/centersection";
import CloseIcon from "@mui/icons-material/Close";
import TextInput from "@/features/shared-features/form/inputtext";
import Button from "@/features/shared-features/common/button";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  setAddFAQFormTrue,
  setAddTicketFormTrue,
} from "@/state/admin/AdminSlice";
import { useEffect, useRef } from "react";
import {
  formContainerCss,
  formOuterDivCss,
  formSmallContainerCss,
  formSubTitleCss,
  formSubmitDivCss,
  formTitleCss,
  formTitleDivCss,
} from "@/features/shared-features/form/props";
import SelectInput from "@/features/shared-features/form/selectinput";
import { createTicket } from "@/state/admin/AdminServices";

const AddTicket = () => {
  const dispatch = useAppDispatch();

  // On submit funciton
  const onSubmit = (data: any) => {
    const transformedData = {
      userType: "USER",
      subject: data?.subject,
      ticketDescription: data?.ticketDescription,
      category: data?.category,
      priority: data?.priority,
      status: "OPEN",
      userId: "cm9gu8ms60000vdg0zdnsxb6z",
      initiatedById: "cm9gu8ms60000vdg0zdnsxb6z",
      resolutionDescription: "",
      proofFiles: "",
      assignedTo: "",
    };
    console.log(transformedData);
    reset();
    dispatch(createTicket(transformedData));
    dispatch(setAddTicketFormTrue(false));
  };

  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.ticket.add
  );

  // React-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    trigger,
    control,
  } = useForm({});

  const form = {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    watch,
    getValues,
    control,
    trigger,
  };

  const formRef = useRef<HTMLDivElement>(null);

  const remaining = { actions: commonActions, form, css: {} };

  const ticketCategoryOptions = [
    { label: "Technical", value: "TECHNICAL" },
    { label: "Billing", value: "BILLING" },
    { label: "Account", value: "ACCOUNT" },
    { label: "General", value: "GENERAL" },
    { label: "Support", value: "SUPPORT" },
    { label: "Security", value: "SECURITY" },
    { label: "Maintenance", value: "MAINTENANCE" },
    { label: "Feedback", value: "FEEDBACK" },
  ];

  const priorityLevelOptions = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
    { label: "Urgent", value: "URGENT" },
  ];

  const formObj = {
    subject: {
      common: fullNameProps({
        input: "subject",
        label: "Subject",
        placeholder: "Enter Issue Subject.",
        showImportant: true,
        type: "text",
      }),
      ...remaining,
    },
    ticketDescription: {
      common: fullNameProps({
        input: "ticketDescription",
        label: "Dscription",
        placeholder: "Enter Issue Descrition.",
        showImportant: true,
        type: "textbox",
      }),
      ...remaining,
    },
    category: {
      common: fullNameProps({
        input: "category",
        label: "Category",
        placeholder: "Select an issue category.",
        showImportant: true,
      }),
      multiple: false,

      options: ticketCategoryOptions,
      ...remaining,
    },
    priority: {
      common: fullNameProps({
        input: "priority",
        label: "Priority",
        placeholder: "Select an issue priority.",
        showImportant: true,
      }),
      multiple: false,

      options: priorityLevelOptions,
      ...remaining,
    },
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector(
        '.MuiPickersPopper-root, [role="dialog"]'
      );
      const clickedInsideCalendar =
        popup?.contains(event.target as Node) ?? false;
      const clickedInsideForm =
        formRef.current?.contains(event.target as Node) ?? false;

      if (!clickedInsideForm && !clickedInsideCalendar) {
        dispatch(setAddFAQFormTrue(false));
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
            className={`${formSmallContainerCss} lg:h-[60%]`}
          >
            <div className={formTitleDivCss}>
              <div className={formTitleCss}>Add New FAQ</div>
              <div className={formSubTitleCss}>
                You’re creating an account on behalf of a user. Please ensure
                accuracy. ⚠️
              </div>
              <div
                className="absolute top-3 right-4 text-red-600 cursor-pointer"
                onClick={(e: any) => dispatch(setAddTicketFormTrue(false))}
              >
                <CloseIcon />
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${formOuterDivCss} lg:gap-8 overflow-y-hidden`}
            >
              <div className="flex flex-col gap-4">
                <TextInput {...formObj.subject} />
                <TextInput {...formObj.ticketDescription} />
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <SelectInput {...formObj.category} />
                  <SelectInput {...formObj.priority} />
                </div>
              </div>

              <div className=" flex flex-col mb-4  justify-center gap-4">
                <Button {...addTicketBtnProps} />
              </div>
            </form>
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddTicket;
