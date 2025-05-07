"use client";

import {
  AdminUserFormValues,
  adminUserSchema,
} from "@/schemas/validation/validationSchema";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cityProps,
  commonActions,
  countryProps,
  emailProps,
  fullNameProps,
  isActiveProps,
  passwordProps,
  phoneProps,
  roleProps,
  streetProps,
  zipCodeProps,
} from "@/features/shared-features/form/formporps";
import CenterSection from "@/features/shared-features/section/centersection";
import UserForm from "../../forms/admin/UserForm";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useForm } from "react-hook-form";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import { setAddCustomerFormTrue } from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";
import { createUser } from "@/state/admin/AdminServices";
import { AdminCustomerFormSchema } from "@/state/admin/admin";
import {
  formContainerCss,
  formSubTitleCss,
  formTitleCss,
  formTitleDivCss,
} from "@/features/shared-features/form/props";

const AddUserForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.user.add
  );
  const { isSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.user.add.response
  );
  // Submit handler
  const onSubmit = (data: any) => {
    dispatch(createUser(data));
    reset();
    console.log(isSuccess);
    dispatch(setAddCustomerFormTrue(false));
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
    resolver: zodResolver(adminUserSchema),
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

  const formObj: any = {
    name: {
      common: fullNameProps({
        input: "name",
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
    address: {
      street: {
        common: streetProps({}),
        ...remaining,
      },
      city: {
        common: cityProps({}),
        ...remaining,
      },
      country: {
        common: countryProps({}),
        ...remaining,
      },
      zipCode: {
        commpn: zipCodeProps({}),
        ...remaining,
      },
    },
    role: {
      common: roleProps({}),
      options,
      ...remaining,
    },
    isActive: {
      common: isActiveProps({}),
      ...remaining,
    },
    password: { common: passwordProps({}), ...remaining },
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        reset();
        dispatch(setAddCustomerFormTrue(false));
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
              <div className={formTitleCss}>Add New User</div>
              <div className={formSubTitleCss}>
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
            <UserForm formObj={formObj} form={form} address={false} />
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default AddUserForm;
