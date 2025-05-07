"use client";

import {
  AdminAppointmentFormValues,
  AdminUserFormValues,
  adminAppointmentSchema,
  adminUserSchema,
} from "@/schemas/validation/validationSchema";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commonActions,
  createdByIdProps,
  customerNameProps,
  dateProps,
  emailProps,
  fullNameProps,
  isForSelfProps,
  messageProps,
  phoneProps,
  selectedDateProps,
  selectedTimeProps,
  serviceIdProps,
  statusProps,
  timeProps,
} from "@/features/shared-features/form/formporps";
import CenterSection from "@/features/shared-features/section/centersection";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useForm } from "react-hook-form";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";

import { setAddAppointmentFormTrue } from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";
import AppointmentForm from "../../forms/admin/AppointmentForm";
import {
  createAppointment,
  retriveAppointment,
  retriveUsers,
} from "@/state/admin/AdminServices";
import { AdminAppointmentFormSchema } from "@/state/admin/admin";
import {
  formContainerCss,
  formSubTitleCss,
  formTitleCss,
  formTitleDivCss,
} from "@/features/shared-features/form/props";

const AddAppointmentForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();
  const { details: userDetails } = useAppSelector(
    (state: RootState) => state.admin.admin.user.view.response
  );
  const { details: serviceDetails } = useAppSelector(
    (state: RootState) => state.admin.admin.service.view.response
  );

  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.add
  );

  // Submit handler
  const onSubmit = (data: AdminAppointmentFormSchema) => {
    console.log(errors, "Error");
    console.log("Form Submitted:", data);
    const updatedData = {
      ...data,
      status: "SCHEDULED",
      userId: data.createdById,
    };
    console.log(updatedData, "transformedData");
    dispatch(createAppointment(updatedData));
    reset();
    dispatch(setAddAppointmentFormTrue(false));
    dispatch(retriveAppointment());
  };

  //  Ref for closing modal on outside click
  const formRef = useRef<HTMLDivElement>(null);

  // React-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    control,
    trigger,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(adminAppointmentSchema),
  });

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

  const options = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Staff", value: "staff" },
  ];

  function getLabelValueArray(
    details: { id: string | number; name: string }[]
  ) {
    return details.map((user) => ({
      label: user.name,
      value: String(user.id),
    }));
  }

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

  const createdByOptions = getLabelValueArray(userDetails);
  const serviceOptions = getServiceOptions(serviceDetails);

  enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    MISSED = "MISSED",
    CANCELLED = "CANCELLED",
    FOLLOW_UP = "FOLLOW_UP",
  }
  const status = [
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Missed", value: "MISSED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Follow Up", value: "FOLLOW_UP" },
  ];

  const formObj: any = {
    firstName: {
      common: customerNameProps({
        input: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Enter Customer First Name",
        showImportant: true,
      }),
      ...remaining,
    },
    lastName: {
      common: customerNameProps({
        input: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Enter Customer Last Name",
        showImportant: true,
        icon: <></>,
      }),
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

    serviceId: {
      common: serviceIdProps({}),
      options: serviceOptions,
      ...remaining,
    },
    selectedDate: {
      common: selectedDateProps({}),
      ...remaining,
    },
    selectedTime: { common: selectedTimeProps({}), ...remaining },

    message: { common: messageProps({}), ...remaining },
  };
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
        reset();
        dispatch(setAddAppointmentFormTrue(false));
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
  }, [isFlag, dispatch]);
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
              <div className={formTitleCss}>Appointment Details</div>
              <div className={formSubTitleCss}>
                Fill out the form below to schedult an appointment on for
                customer. Review all details before submitting.
              </div>
              <div
                className="absolute top-3 right-4 text-red-600 cursor-pointer"
                onClick={(e: any) => dispatch(setAddAppointmentFormTrue(false))}
              >
                <CloseIcon />
              </div>
            </div>

            <AppointmentForm formObj={formObj} form={form} />
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddAppointmentForm;
