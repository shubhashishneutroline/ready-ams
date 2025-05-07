"use client";

import {
  AdminUserFormValues,
  adminAppointmentSchema,
  adminUserSchema,
} from "@/schemas/validation/validationSchema";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addAppointmentBtnProps,
  cancelBtnProps,
  commonActions,
  createdByIdProps,
  customerNameProps,
  emailProps,
  isForSelfProps,
  messageProps,
  phoneProps,
  selectedDateProps,
  selectedTimeProps,
  serviceIdProps,
  statusProps,
} from "@/features/shared-features/form/formporps";
import Button from "@/features/shared-features/common/button";
import CenterSection from "@/features/shared-features/section/centersection";
import UserForm from "../../forms/admin/UserForm";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useForm } from "react-hook-form";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  setAddAppointmentFormTrue,
  setEditAppointmentFormTrue,
  setEditAppointmentId,
} from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";
import {
  createUser,
  retriveAppointment,
  updateAppointment,
  updateUser,
} from "@/state/admin/AdminServices";
import { AdminCustomerFormSchema } from "@/state/admin/admin";
import { passwordProps } from "../../../shared-features/form/formporps";
import { IdCard } from "lucide-react";
import AppointmentForm from "../../forms/admin/AppointmentForm";
import { DateInput, TimeInput } from "@/features/shared-features/form/dayinput";
import TextInput from "@/features/shared-features/form/inputtext";
import {
  formOuterDivCss,
  formSubmitDivCss,
} from "@/features/shared-features/form/props";
import SelectInput from "@/features/shared-features/form/selectinput";

const EditAppointmentForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();

  const { details: userDetails } = useAppSelector(
    (state: RootState) => state.admin.admin.user.view.response
  );
  const { details: serviceDetails } = useAppSelector(
    (state: RootState) => state.admin.admin.service.view.response
  );
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.edit
  );
  const { isSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.user.add.response
  );
  const { id } = useAppSelector(
    (state: RootState) => state.admin.platform.appointment._edit_AppointmentForm
  );
  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.view.response
  );
  const dataToEdit = details?.find((u: any) => u.id === id);
  const handleCancleButton = () => {
    dispatch(setEditAppointmentFormTrue(false));
  };
  // Submit handler
  const onSubmit = (data: any, id: any) => {
    const updatedData = {
      customerName: `${data.firstName} ${data.lastName}`,
      email: data.email ?? dataToEdit.email,
      phone: data.phone ?? dataToEdit.phone,
      selectedDate: data.selectedDate ?? dataToEdit.selectedDate,
      selectedTime: data.selectedTime ?? dataToEdit.selectedTime,
      serviceId: data.serviceId ?? dataToEdit.serviceId,
      message: data.message ?? dataToEdit.message,
      status: data.status ?? dataToEdit.status,
    };
    const transformedData = { ...dataToEdit, ...updatedData };

    // dispatch(updateUser({ ...data, id: dataToEdit.id }));

    dispatch(setEditAppointmentId(""));
    dispatch(updateAppointment(transformedData, id));

    // reset();

    dispatch(setEditAppointmentFormTrue(false));
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
    trigger,
    control,
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
    { label: "Admin", value: "ADMIN" },
    { label: "User", value: "USER" },
    { label: "Super Admin", value: "SUPERADMIN" },
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

  const splitFullName = (
    fullName?: string
  ): { firstName: string; lastName: string } => {
    if (!fullName || typeof fullName !== "string") {
      return { firstName: "", lastName: "" };
    }

    const nameParts = fullName.trim().split(" ");

    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    return { firstName, lastName };
  };
  const { firstName, lastName } = splitFullName(dataToEdit?.customerName);
  const createdByOptions = getLabelValueArray(userDetails);
  const serviceOptions = getServiceOptions(serviceDetails);
  const appointmentStatusOptions = [
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
        defaultValue: firstName,
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
        defaultValue: lastName,
      }),
      ...remaining,
    },
    email: {
      common: emailProps({ defaultValue: dataToEdit?.email }),
      ...remaining,
    },
    phone: {
      common: phoneProps({ defaultValue: dataToEdit?.phone }),
      ...remaining,
    },

    serviceId: {
      common: serviceIdProps({ defaultValue: dataToEdit?.serviceId }),
      options: serviceOptions,
      ...remaining,
    },
    selectedDate: {
      common: selectedDateProps({ defaultValue: dataToEdit?.selectedDate }),
      ...remaining,
    },
    status: {
      common: customerNameProps({
        input: "status",
        label: "Status",
        type: "text",
        placeholder: "Select Status",
        showImportant: true,
        icon: <></>,
        defaultValue: dataToEdit?.status,
      }),
      options: appointmentStatusOptions,
      ...remaining,
    },
    selectedTime: {
      common: selectedTimeProps({ defaultValue: dataToEdit?.selectedTime }),
      ...remaining,
    },

    message: {
      common: messageProps({ defaultValue: dataToEdit?.message }),
      ...remaining,
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        reset();
        dispatch(setEditAppointmentFormTrue(false));
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
            className="h-[90%] sm:h-[80%] lg:h-[95%] w-[90%] sm:w-[75%] lg:w-[50%] bg-white rounded-2xl shadow-xl flex flex-col overflow-y-auto"
          >
            <div className="relative h-[120px] lg:h-[140px] bg-gradient-to-b from-blue-300 to-white flex flex-col text-black justify-items-center  py-2 gap-2 px-4">
              <div className="flex md:flex-col items-center justify-center gap-2 md:gap-0 pt-3">
                <PersonAddAltIcon
                  sx={{
                    fontSize: {
                      xs: "20px",
                      sm: "22px",
                      lg: "24px",
                      xl: "28px",
                    },
                  }}
                />
                <div className="text-[16px] sm:text-[18px] md:text-[20px] 2xl:text-[32px] font-normal lg:font-semibold ">
                  Edit User Details
                </div>
              </div>
              <div className="flex justify-center text-center text-[11px] sm:text-[13px] lg:text-[14px] text-[#455A64]">
                You’re editing an account details on behalf of a user. Please
                ensure accuracy. ⚠️
              </div>
              <div
                className="absolute top-3 right-4 text-red-600 cursor-pointer"
                onClick={(e: any) => {
                  dispatch(setEditAppointmentFormTrue(false));
                  dispatch(setEditAppointmentId(""));
                }}
              >
                <CloseIcon />
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={formOuterDivCss}>
              <div className="flex flex-col sm:gap-2 ">
                <div className="flex flex-row">
                  <TextInput {...formObj.firstName} />
                  <TextInput {...formObj.lastName} />
                </div>
                <TextInput {...formObj.email} />
                <TextInput {...formObj.phone} />
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <SelectInput {...formObj.serviceId} />

                  <SelectInput {...formObj.status} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <DateInput {...formObj.selectedDate} />
                  <TimeInput {...formObj.selectedTime} />
                </div>
                <TextInput {...formObj.message} />
              </div>
              <div className={formSubmitDivCss}>
                <Button {...cancelBtnProps(handleCancleButton)} />
                <Button {...addAppointmentBtnProps()} />
              </div>
            </form>
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default EditAppointmentForm;
