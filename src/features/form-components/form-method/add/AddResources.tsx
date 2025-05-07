"use client";

import {
  addUserBtnProps,
  commonActions,
  emailProps,
  fullNameProps,
  roleProps,
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
  setAddStaffResourceTrue,
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
import { createStaff, retriveService } from "@/state/admin/AdminServices";
import SelectInput from "@/features/shared-features/form/selectinput";
import { Service } from "@/features/service/types/types";

const AddStaffResources = () => {
  // On submit funciton
  const onSubmit = (data: any) => {
    const formattedServices = details?.filter((detail: Service) => {
      const services = data.services;

      if (Array.isArray(services)) {
        if (typeof services[0] === "string") {
          // array of IDs
          return services.includes(detail.id);
        } else if (typeof services[0] === "object" && services[0].id) {
          // array of objects with id
          return services.some((service: any) => service.id === detail.id);
        }
      }

      return false;
    });
    const transformedData = {
      ...data,
      services: formattedServices,  
    };

    reset();

    dispatch(createStaff(transformedData));
    // console.log(formattedServices, "formattedServices");

    dispatch(setAddStaffResourceTrue(false));
  };

  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.service.view.response
  );
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.resources.staff.add
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

  const serviceOptions = getServiceOptions(details);

  const formObj = {
    name: {
      common: fullNameProps({
        input: "name",
        label: "Staff Name",
        placeholder: "Enter Staff Name",
        showImportant: true,
        type: "text",
      }),
      ...remaining,
    },
    email: {
      common: emailProps({}),
      ...remaining,
    },
    phone: {
      common: roleProps({
        input: "phone",
        label: "Phone",
        placeholder: "Enter Your Phone Number",
        showImportant: true,
      }),
      ...remaining,
    },
    role: { common: roleProps({}), ...remaining },
    address: {
      common: roleProps({
        input: "address",
        label: "Address",
        placeholder: "Enter Full Address",
        showImportant: true,
      }),
      ...remaining,
    },
    services: {
      common: roleProps({
        input: "services",
        label: "Linked Services",
        placeholder: "Select all the appropriate services.",
        showImportant: true,
      }),
      options: serviceOptions,
      multiple: true,
      ...remaining,
    },
  };
  useEffect(() => {
    dispatch(retriveService());
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector(
        '.MuiPickersPopper-root, [role="dialog"]'
      );
      const clickedInsideCalendar =
        popup?.contains(event.target as Node) ?? false;
      const clickedInsideForm =
        formRef.current?.contains(event.target as Node) ?? false;

      if (!clickedInsideForm && !clickedInsideCalendar) {
        dispatch(setAddStaffResourceTrue(false));
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
            className={`${formSmallContainerCss} lg:h-[70%] lg:w-[50%]`}
          >
            <div className={formTitleDivCss}>
              <div className={formTitleCss}>Add Staff Member</div>
              <div className={formSubTitleCss}>
                You’re creating an member account on behalf of a staff. Please
                ensure accuracy. ⚠️
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${formOuterDivCss} overflow-y-auto lg:overflow-y-hidden scrollbar gap-8`}
            >
              <div className="flex-col gap-3 flex">
                <TextInput {...formObj.name} />

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <TextInput {...formObj.email} />
                  <TextInput {...formObj.phone} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <TextInput {...formObj.role} />
                  <TextInput {...formObj.address} />
                </div>

                <SelectInput {...formObj.services} />
              </div>
              <div className=" flex flex-col mb-4  justify-center gap-4">
                <Button {...addUserBtnProps} />
              </div>
            </form>
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddStaffResources;
