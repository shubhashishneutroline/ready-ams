"use client";

import {
  AdminUserFormValues,
  adminEditUserSchema,
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
import {
  setAddCustomerFormTrue,
  setEditCustomerFormTrue,
} from "@/state/admin/AdminSlice";
import CloseIcon from "@mui/icons-material/Close";
import {
  createUser,
  retriveUsers,
  updateUser,
} from "@/state/admin/AdminServices";
import { AdminCustomerFormSchema } from "@/state/admin/admin";
import { passwordProps } from "../../../shared-features/form/formporps";
import { IdCard } from "lucide-react";

const EditUserForm = () => {
  // Redux Variable
  const dispatch = useAppDispatch();
  const { isFlag } = useAppSelector(
    (state: RootState) => state.admin.admin.user.edit
  );
  const { isSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.user.add.response
  );
  const { id } = useAppSelector(
    (state: RootState) => state.admin.platform.user._edit_CustomerForm
  );

  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.user.view.response
  );
  const dataToEdit = details?.find((u: any) => u.id === id);

  // Submit handler
  const onSubmit = (data: any, id: any) => {
    const addressAddedData = {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role.toUpperCase(),
      isActive: data.isActive,
      // address: {
      //   street: data.street,
      //   city: data.city,
      //   country: data.country,
      //   zipCode: "46400",
      // },
    };
    const transformedData = { ...dataToEdit, ...addressAddedData };

    dispatch(updateUser(transformedData, id));
    reset();
    dispatch(setEditCustomerFormTrue(false));
    dispatch(retriveUsers());
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
    resolver: zodResolver(adminEditUserSchema),
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

  const formObj: any = dataToEdit
    ? {
        name: {
          common: fullNameProps({
            input: "name",
            defaultValue: dataToEdit.name,
          }),
          ...remaining,
        },
        email: {
          common: emailProps({ defaultValue: dataToEdit.email }),
          ...remaining,
        },
        phone: {
          common: phoneProps({ defaultValue: dataToEdit.phone }),
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
          common: roleProps({ defaultValue: dataToEdit.role }),
          options,
          ...remaining,
        },
        isActive: {
          common: isActiveProps({
            defaultValue: dataToEdit.isActive.toLowerCase,
          }),
          ...remaining,
        },
        password: {
          common: passwordProps({ defaultValue: dataToEdit.password }),
          ...remaining,
        },
      }
    : null;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        reset();
        dispatch(setEditCustomerFormTrue(false));
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
                onClick={(e: any) => dispatch(setEditCustomerFormTrue(false))}
              >
                <CloseIcon />
              </div>
            </div>
            <UserForm formObj={formObj} form={form} address={true} />
          </motion.div>
        </CenterSection>
      )}
    </AnimatePresence>
  );
};

export default EditUserForm;
