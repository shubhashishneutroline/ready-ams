"use client";

import React, { useState } from "react";
import {
  addTicketBtnProps,
  addUserBtnProps,
  cancelBtnProps,
  cityProps,
  commonActions,
  emailProps,
  emptyFormProps,
  fullNameProps,
  messageProps,
  phoneProps,
  roleProps,
} from "@/features/shared-features/form/formporps";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/state/store";
import { setAddNotificationFormTrue } from "@/state/admin/AdminSlice";
import Button from "@/features/shared-features/common/button";
import SelectInput from "@/features/shared-features/form/selectinput";
import { ReminderCheckboxes } from "@/features/shared-features/form/remindercheckerinput";
import TextInput from "@/features/shared-features/form/inputtext";
import {
  DateInput,
  DaysSelection,
  TimeInput,
} from "@/features/shared-features/form/dayinput";
import SwitchInput from "@/features/shared-features/form/switchinput";
import { DayAndTimeSelection } from "@/features/shared-features/form/dayandtimeselection";
import { formOuterDivCss } from "@/features/shared-features/form/props";
import { createTicket } from "@/state/admin/AdminServices";

const AdminSupportForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();

  // Submit handler
  const onSubmit = (data: any) => {
    const transformedData = {
      userType: "ADMIN",
      subject: data?.subject,
      ticketDescription: data?.ticketDescription,
      category: data?.category,
      priority: data?.priority,
      status: "OPEN",
      userId: "cm9gu8ms60000vdg0zdnsxb6z",
      initiatedById: "cm9gu8ms60000vdg0zdnsxb6z",
      resolutionDescription: "",
      proofFiles: data?.attachment || "",
      assignedTo: "",
    };
    console.log(transformedData);
    reset();
    dispatch(createTicket(transformedData));
  };

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

  const formObj: any = {
    fullName: {
      common: fullNameProps({}),
      ...remaining,
    },
    email: {
      common: emailProps({}),
      ...remaining,
    },
    phone: {
      common: phoneProps({}),
      ...remaining,
    },
 
    category: {
      common: emptyFormProps({
        input: "category",
        label: "Issue Category",
        placeholder: "Select Issue",
        showImportant: true,
        type: "select",
      }),
      options: ticketCategoryOptions,
      multiple: false,
      ...remaining,
    },

    subject: {
      common: emptyFormProps({
        input: "subject",
        label: "Issue Subject",
        placeholder: "Enter the Issue's Subject",
        showImportant: true,
        type: "text",
      }),

      ...remaining,
    },
    ticketDescription: {
      common: emptyFormProps({
        input: "ticketDescription",
        label: " Description",
        placeholder: "Enter the Issue in Detail",
        showImportant: true,
        type: "textbox",
      }),

      ...remaining,
    },
    proofFiles: {
      common: emptyFormProps({
        input: "proofFiles",
        label: " Attachment (if any)",
        placeholder: "Upload Supporting Document",
        showImportant: true,
        type: "file",
      }),

      ...remaining,
    },
    priority: {
      common: emptyFormProps({
        input: "priority",
        label: " Priority Level",
        placeholder: "Select Priority Level",
        showImportant: true,
      }),
      options: priorityLevelOptions,
      multiple: false,

      ...remaining,
    },
  };
  const handleCancleButton = () => {
    dispatch(setAddNotificationFormTrue(false));
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${formOuterDivCss}  gap-8 w-full lg:w-[880px]`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col jutify-start px-2  gap-2   ">
          <h1 className="text-black font-semibold text-[18px]">Any Queries?</h1>
          <p className="italic text-[12px] sm:text-[14px] text-slate-600">
            Following details will be used to create an Admin Ticket
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="col-span-1">
              <TextInput {...formObj.fullName} />
            </div>
            <div className="col-span-1">
              <TextInput {...formObj.email} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="cols-span-1">
              <TextInput {...formObj.phone} />
            </div>
            <div className="cols-span-1">
              <SelectInput {...formObj.category} />
            </div>
          </div>
          <TextInput {...formObj.subject} />
          <TextInput {...formObj.ticketDescription} />
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="cols-span-1">
              <TextInput {...formObj.proofFiles} />
            </div>
            <div className="cols-span-1">
              <SelectInput {...formObj.priority} />
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col mb-4 w-full justify-center gap-4">
        <Button {...addTicketBtnProps} />
      </div>
    </form>
  );
};

export default AdminSupportForm;
