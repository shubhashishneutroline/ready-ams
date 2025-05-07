"use client";
import Button from "@/features/shared-features/common/button";

import { addUserBtnProps } from "@/features/shared-features/form/formporps";

import TextInput from "@/features/shared-features/form/inputtext";
import PasswordInput from "@/features/shared-features/form/passwordinput";
import InputPhone from "@/features/shared-features/form/phoneinput";
import SelectInput from "@/features/shared-features/form/selectinput";
import SwitchInput from "@/features/shared-features/form/switchinput";
import React from "react";
import { cancelBtnProps } from "../../../shared-features/form/formporps";
import { setAddCustomerFormTrue } from "@/state/admin/AdminSlice";
import { useDispatch } from "react-redux";
import { formOuterDivCss } from "@/features/shared-features/form/props";

const UserForm = (props: any) => {
  const { formObj, form, address } = props;

  const { handleSubmit, onSubmit } = form;

  const dispatch = useDispatch();

  const handleCancleButton = () => {
    dispatch(setAddCustomerFormTrue(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formOuterDivCss}>
      <div className="flex flex-col gap-2">
        <TextInput {...formObj.name} />
        <TextInput {...formObj.email} />
        <TextInput {...formObj.phone} />
        {address && (
          <div className="flex flex-col md:flex-row gap-2">
            <TextInput {...formObj.address.street} />
            <TextInput {...formObj.address.city} />
            <TextInput {...formObj.address.country} />
            {/* <TextInput {...formObj.zipCode} /> */}
          </div>
        )}
        <SelectInput {...formObj.role} />
        <div className="flex flex-col gap-2">
          <PasswordInput {...formObj.password} />
          <SwitchInput {...formObj.isActive} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
        <Button {...cancelBtnProps(handleCancleButton)} />
        <Button {...addUserBtnProps} />
      </div>
    </form>
  );
};

export default UserForm;
