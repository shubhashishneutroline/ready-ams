"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cityProps,
  commonActions,
  countryProps,
  emailProps,
  emptyFormProps,
  fullNameProps,
  isActiveProps,
  passwordProps,
  phoneProps,
  roleProps,
  streetProps,
} from "@/features/shared-features/form/formporps";
import CenterSection from "@/features/shared-features/section/centersection";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useForm } from "react-hook-form";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  setAddAvailabilityFormTrue,
  setAddCustomerFormTrue,
} from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";

import BusinessAvailabilityForm from "../../forms/admin/BusinessAvailabilityForm";

const AddBusinessAvailabilityForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.availability.add
  );
  const { isSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.user.add.response
  );
  // Submit handler
  const onSubmit = (data: any) => {
    console.log(data);
    // dispatch(createUser(data));
    // reset();
    // console.log(isSuccess);
    // dispatch(setAddCustomerFormTrue(false));
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
    // resolver: zodResolver(adminUserSchema),
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

  const remaining = { actions: commonActions, form };

  const options = [
    { label: "Mon", value: "MONDAY" },
    { label: "Tue", value: "TUESDAY" },
    { label: "Wed", value: "WEDNESDAY" },
    { label: "Thu", value: "THURSDAY" },
    { label: "Fri", value: "FRIDAY" },
    { label: "Sat", value: "SATURDAY" },
    { label: "Sun", value: "SUNDAY" },
  ];

  const formObj: any = {
    timeZone: {
      common: fullNameProps({
        input: "timezone",
        label: "Time Zone",
        placeholder: "Enter your time zone.",
        showImportant: true,
      }),
      css: {},
      ...remaining,
    },
    businessDay: {
      common: emptyFormProps({
        input: "businessDay",
        label: "Business Day",
        placeholder: "Enter your time zone.",
        showImportant: true,
      }),
      css: {
        divCss:
          "relative h-[65px] sm:h-[75px] lg:h-[125px] pt-1 flex flex-col gap-1 text-[11px] text-black w-11/12 w-full px-2",
      },

      options,
      ...remaining,
    },
    businessHours: {
      common: roleProps({
        input: "businessHours",
        label: "Business Day / Hour",
        showImportant: true,
      }),

      ...remaining,
    },
    holiDays: {
      common: emptyFormProps({
        input: "holiDays",
        label: "Holidays",
        placeholder: "Enter your time zone.",
        showImportant: true,
      }),
      css: {
        divCss:
          "relative h-[65px] sm:h-[75px] lg:h-[125px] pt-1 flex flex-col gap-1 text-[11px] text-black w-11/12 w-full px-2",
      },

      options,
      ...remaining,
    },
    // phone_number: {
    //   common: phoneProps({}),
    //   ...remaining,
    //   css: {},
    // },
    // address: {
    //   street: {
    //     common: streetProps({}),
    //     ...remaining,
    //   },
    //   city: {
    //     common: cityProps({}),
    //     ...remaining,
    //   },
    //   country: {
    //     common: countryProps({}),
    //     ...remaining,
    //   },
    // },
    // role: {
    //   common: roleProps({}),
    //   options,
    //   ...remaining,
    // },
    // isActive: {
    //   common: isActiveProps({}),
    //   ...remaining,
    // },
    // password: { common: passwordProps({}), ...remaining },
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        reset();
        dispatch(setAddAvailabilityFormTrue(false));
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
                  Add New User
                </div>
              </div>
              <div className="flex justify-center text-center text-[11px] sm:text-[13px] lg:text-[14px] text-[#455A64]">
                You’re creating an account on behalf of a user. Please ensure
                accuracy. ⚠️
              </div>
              <div
                className="absolute top-3 right-4 text-red-600 cursor-pointer"
                onClick={(e: any) => dispatch(setAddCustomerFormTrue(false))}
              >
                <CloseIcon />
              </div>
            </div>
            <BusinessAvailabilityForm formObj={formObj} form={form} />
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddBusinessAvailabilityForm;
