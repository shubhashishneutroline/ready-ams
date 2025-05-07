"use client";
import Button from "@/features/shared-features/common/button";
import { addServiceBtnProps } from "@/features/shared-features/form/formporps";
import TextInput from "@/features/shared-features/form/inputtext";
import SelectInput from "@/features/shared-features/form/selectinput";
import SwitchInput from "@/features/shared-features/form/switchinput";
import React, { useEffect, useState } from "react";
import { cancelBtnProps } from "../../../shared-features/form/formporps";
import { setAddServiceFormTrue } from "@/state/admin/AdminSlice";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";

import { DayAndTimeSelection } from "@/features/shared-features/form/dayandtimeselection";
import { retrieveBusiness } from "@/state/admin/AdminServices";
import { DaysSelection } from "@/features/shared-features/form/dayinput";

import {
  formOuterDivCss,
  formSubmitDivCss,
} from "@/features/shared-features/form/props";

const ServiceForm = (props: any) => {
  const { formObj, form, availaibility, setAvailability } = props;
  const dispatch = useAppDispatch();
  function getLabelValueArray(
    details: { id: string | number; name: string }[]
  ) {
    return details.map((user) => ({
      label: user.name,
      value: String(user.id),
    }));
  }
  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.business.view.response
  );
  const { handleSubmit, onSubmit } = form;

  const handleCancleButton = () => {
    dispatch(setAddServiceFormTrue(false));
  };

  useEffect(() => {
    dispatch(retrieveBusiness());
  }, [dispatch, availaibility]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formOuterDivCss}>
      <div className="flex flex-col gap-2">
        <TextInput {...formObj.title} />
        <TextInput {...formObj.description} />
        <TextInput {...formObj.coverPhoto} />
        <div className="flex flex-col gap-2 w-full pb-2">
          <label
            // className="text-black font-semibold flex gap-2 text-[12px] sm:text-[14px] lg:text-[16px] 2xl:text-[18px] items-center"
            className="relative pt-2 flex flex-col gap-2 text-sm text-gray-800 w-full max-w-full px-2 sm:px-3 lg:px-4"
          >
            <div className="font-medium flex items-center gap-2 text-sm sm:text-[15px] lg:text-[15px] text-[#1F2937] tracking-wide">
              <WorkHistoryIcon
                className="text-[#6C757D]"
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                    lg: "16px",
                  },
                }}
              />
              Availability
            </div>
          </label>
          <div className="flex gap-4 px-4">
            <div
              onClick={() => setAvailability("default")}
              className={`cursor-pointer border rounded-lg px-4 py-1 transition-colors ${
                availaibility === "default"
                  ? "bg-blue-500 text-white border-blue-500 shadow-inner shadow-lg"
                  : "bg-white text-gray-800 border-gray-400 shadow-inner shadow-lg"
              }`}
            >
              Default
            </div>
            <div
              onClick={() => setAvailability("custom")}
              className={`cursor-pointer border rounded-lg px-4 py-1 transition-colors ${
                availaibility === "custom"
                  ? "bg-blue-500 text-white border-blue-500 shadow-inner shadow-lg"
                  : "bg-white text-gray-800 border-gray-400 shadow-inner shadow-lg"
              }`}
            >
              Custom
            </div>
          </div>
        </div>
        <DaysSelection {...formObj.serviceAvailability} />

        <DayAndTimeSelection {...formObj.serviceHourDay} />

        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          <SwitchInput {...formObj.avalabilities} />
          <SelectInput {...formObj.estimatedDuration} />
        </div>

        {/* <SelectInput {...formObj.businessDetailId} options={businessOptions} /> */}
      </div>
      <div className={formSubmitDivCss}>
        <Button {...cancelBtnProps(handleCancleButton)} />
        <Button {...addServiceBtnProps()} />
      </div>
    </form>
  );
};

export default ServiceForm;
