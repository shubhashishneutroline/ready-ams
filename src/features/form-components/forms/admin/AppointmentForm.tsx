"use client";
import Button from "@/features/shared-features/common/button";
import {
  addAppointmentBtnProps,
  addUserBtnProps,
} from "@/features/shared-features/form/formporps";
import TextInput from "@/features/shared-features/form/inputtext";
import SelectInput from "@/features/shared-features/form/selectinput";
import SwitchInput from "@/features/shared-features/form/switchinput";
import React from "react";
import { cancelBtnProps } from "../../../shared-features/form/formporps";
import { setAddAppointmentFormTrue } from "@/state/admin/AdminSlice";
import { DateInput, TimeInput } from "@/features/shared-features/form/dayinput";
import { useAppDispatch } from "@/state/store";
import ControllerSelectInput from "@/features/shared-features/form/selectContollerInput";
import {
  formOuterDivCss,
  formSubmitDivCss,
} from "@/features/shared-features/form/props";

const AppointmentForm = (props: any) => {
  const { formObj, form } = props;

  const { handleSubmit, onSubmit } = form;

  const dispatch = useAppDispatch();

  const handleCancleButton = () => {
    dispatch(setAddAppointmentFormTrue(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formOuterDivCss}>
      <div className="flex flex-col sm:gap-2 ">
        <div className="flex flex-row">
          <TextInput {...formObj.firstName} />
          <TextInput {...formObj.lastName} />
        </div>
        <TextInput {...formObj.email} />
        <TextInput {...formObj.phone} />
        <SelectInput {...formObj.serviceId} />
        <div className="flex flex-row justify-between items-center">
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
  );
};

export default AppointmentForm;
