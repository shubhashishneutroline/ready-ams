/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { InputSchema, SelectInputSchema } from "@/schemas/schema";
import { getFormErrorMsg } from "@/utils/utils";
import { useState, useEffect, useRef } from "react";
import { FormSpanError } from "./error/fromspanerror";
import { formDivCss, formLabelCss, formErrorCss, formInputCss } from "./props";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";

export interface OptionSchema {
  label: string;
  value: string;
}
[];

export function DaysSelection(props: SelectInputSchema) {
  // Props
  const { common, form, css, options } = props;
  const {
    input,
    label,
    defaultValue,
    placeholder,
    showImportant,
    icon,
    format,
  } = common;
  const { setValue, errors } = form;
  const { divCss, labelCss, errorCss } = css ?? {};

  // State
  const [selectedDays, setSelectedDays] = useState<string[]>(
    defaultValue ? defaultValue : []
  );
  const message =
    "Service days are set based on working days. To modify, update working days in Business Settings > Availability > Business Days.";
  const errorMsg = getFormErrorMsg(errors, input);
  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;

  // Sync selectedDays with form value
  useEffect(() => {
    setValue(input, selectedDays);
  }, [selectedDays, setValue, input]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedDays(defaultValue);
    }
  }, [defaultValue]);

  // console.log(defaultValue, "defaultvalue");
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className={`${finalDivCss} px-4  h-[110px] sm:h-auto`}>
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      <div
        className={`${
          options.length === 7
            ? " grid grid-cols-4 sm:grid-cols-5 gap-x-4 gap-y-3 "
            : "flex flex-wrap gap-8"
        }`}
      >
        {options.map((day: any) => {
          const isSelected = selectedDays.includes(day.value);

          // Determine if the day should be disabled based on `type`
          const isDisabled =
            format === "default"
              ? !defaultValue?.includes(day.value)
              : defaultValue && !defaultValue.includes(day.value);

          return (
            <div
              key={day.value}
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                if (!isDisabled) toggleDay(day.value);
              }}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-5 h-5 flex text-[12px] justify-center-center rounded-sm border transition-all cursor-pointer hidden sm:block ${
                  isDisabled
                    ? "bg-red-500/90 border-red-500/90 text-white cursor-not-allowed"
                    : isSelected
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-400 text-gray-500"
                }`}
              >
                <div className="flex items-center justify-center">
                  {isDisabled ? "✕" : isSelected ? "✓" : "-"}
                </div>
              </div>

              {/* Day Label */}
              <span
                className={`flex justify-center w-[70px] sm:w-[80px] py-1.5 sm:py-2 rounded-lg border text-[12px] sm:text-[13px]  font-medium transition-all 
                  ${
                    isDisabled
                      ? "bg-red-500/90 text-white border-red-500/90 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-400 text-black"
                  }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      {input === "serviceAvailability" && (
        <div className="text-gray-700  text-[11px]">
          Service days are set based on working days. To modify, update working
          days in{" "}
          <strong className="text-gray-700 text-[11px]">
            Business Settings
          </strong>{" "}
          &gt; <strong>Availability</strong> &gt; <strong>Business Days</strong>
          .
        </div>
      )}

      {errorMsg && (
        <FormSpanError
          css={{ customCss: errorCss ?? formErrorCss }}
          title={errorMsg}
        />
      )}
    </div>
  );
}

export function DateInput(props: InputSchema) {
  const { common, actions, form, css } = props;
  const { input, label, defaultValue, placeholder, showImportant, icon } =
    common;

  const { register, errors, trigger, control } = form;
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } =
    actions || {};
  const { divCss, labelCss, inputCss, errorCss } = css || {};

  const errorMsg = getFormErrorMsg(errors, input);

  const highlightBorder =
    "border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const errorBorder =
    "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400";
  const border = errorMsg ? errorBorder : highlightBorder;

  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = inputCss ?? formInputCss;

  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    await trigger(input);
    if (handleOnChange) {
      handleOnChange(e);
    }
  };

  return (
    <div className={`${finalDivCss}  min-w-[150px]`}>
      {label && (
        <label
          // className="text-black font-semibold flex gap-2 text-[12px] sm:text-[14px] lg:text-[16px] 2xl:text-[18px] items-center"
          className={finalLabelCss}
          htmlFor={input}
        >
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={input}
          control={control}
          defaultValue={defaultValue ?? null}
          render={({ field }) => (
            <DesktopDatePicker
              className="datepicker"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                const formattedDate = newValue
                  ? newValue
                      .startOf("day")
                      .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
                  : "";
                field.onChange(formattedDate);
              }}
              slotProps={{
                textField: {
                  id: input,
                  placeholder,
                  onClick: handleClick,
                  onKeyDown: handleKeyDown,
                  onKeyUp: handleKeyUp,
                  error: false,
                  fullWidth: true,
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      borderRadius: "0.5rem", // rounded-lg
                      height: {
                        xs: "34px", // h-[40px]
                        sm: "34px", // sm:h-[44px]
                        lg: "38px", // lg:h-[42px]
                      },
                      px: "0.75rem", // px-3
                      fontSize: {
                        xs: "11px", // h-[40px]
                        sm: "12px", // sm:h-[44px]
                        lg: "14px", // lg:h-[42px]
                      }, /// text-[14px]
                      color: "#1F2937", // text-gray-800 (#1F2937)
                      backgroundColor: "#F9FAFB", // bg-[#F9FAFB]
                      border: "1px solid #D1D5DB", // border-gray-300
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
                      width: "100%", // w-full
                      placeholder: {
                        color: "#9CA3AF", // placeholder:text-gray-400
                      },
                      transition: "all 0.2s ease-in-out", // transition-all duration-200 ease-in-out
                      "&:focus-within": {
                        outline: "none",
                        borderColor: "#3B82F6", // focus:border-blue-500
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", // focus:ring-2 focus:ring-blue-500
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "18px",
                      },
                    },
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>

      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}

export function TimeInput(props: InputSchema) {
  const { common, actions, form, css } = props;
  const { input, label, defaultValue, placeholder, showImportant, icon } =
    common;
  const { register, errors, trigger, control } = form;
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } =
    actions || {};
  const { divCss, labelCss, inputCss, errorCss } = css || {};

  const errorMsg = getFormErrorMsg(errors, input);

  const highlightBorder =
    "border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const errorBorder =
    "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400";
  const border = errorMsg ? errorBorder : highlightBorder;

  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = inputCss ?? formInputCss;

  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    await trigger(input);
    if (handleOnChange) {
      handleOnChange(e);
    }
  };

  return (
    <div className={`${finalDivCss}  min-w-[150px]`}>
      {label && (
        <label
          // className="text-black font-semibold flex gap-2 text-[12px] sm:text-[14px] lg:text-[16px] 2xl:text-[18px] items-center"
          className={finalLabelCss}
          htmlFor={input}
        >
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={input}
          control={control}
          defaultValue={defaultValue ?? ""}
          render={({ field }) => (
            <DesktopTimePicker
              className="datePicker"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                const localTime = newValue ? newValue.toISOString() : "";
                field.onChange(localTime);
              }}
              slotProps={{
                textField: {
                  id: input,
                  placeholder,
                  onClick: handleClick,
                  onKeyDown: handleKeyDown,
                  onKeyUp: handleKeyUp,
                  error: false,
                  fullWidth: true,
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      borderRadius: "0.5rem", // rounded-lg
                      height: {
                        xs: "34px", // h-[40px]
                        sm: "34px", // sm:h-[44px]
                        lg: "38px", // lg:h-[42px]
                      },
                      px: "0.75rem", // px-3
                      fontSize: {
                        xs: "11px", // h-[40px]
                        sm: "12px", // sm:h-[44px]
                        lg: "14px", // lg:h-[42px]
                      }, /// text-[14px]
                      color: "#1F2937", // text-gray-800 (#1F2937)
                      backgroundColor: "#F9FAFB", // bg-[#F9FAFB]
                      border: "1px solid #D1D5DB", // border-gray-300
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
                      width: "100%", // w-full
                      placeholder: {
                        color: "#9CA3AF", // placeholder:text-gray-400
                      },
                      transition: "all 0.2s ease-in-out", // transition-all duration-200 ease-in-out
                      "&:focus-within": {
                        outline: "none",
                        borderColor: "#3B82F6", // focus:border-blue-500
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)", // focus:ring-2 focus:ring-blue-500
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "18px",
                      },
                    },
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>

      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}

export function HoliDaysSelection(props: SelectInputSchema) {
  // Props
  const { common, form, css, options } = props;
  // Props variables
  const { input, label, defaultValue, placeholder, showImportant, icon, type } =
    common;
  console.log(defaultValue, "default Holiday value");
  const { setValue, errors } = form;
  const { divCss, labelCss, errorCss } = css!;

  // States
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const daysOfWeek = options;
  // Values
  const errorMsg = getFormErrorMsg(errors, input);

  // Css
  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;

  useEffect(() => {
    if (defaultValue) {
      setSelectedDays(defaultValue);
    }
  }, [defaultValue]);
  // Update form value when selectedDays changes
  useEffect(() => {
    setValue(input, selectedDays); // Register the selected days to React Hook Form
  }, [selectedDays, setValue, input]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className={`${finalDivCss} h-[120px] sm:h-auto`}>
      {label && (
        <label
          // className="text-black font-semibold flex gap-2 text-[12px] sm:text-[14px] lg:text-[16px] 2xl:text-[18px] items-center"
          className={finalLabelCss}
          htmlFor={input}
        >
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="grid grid-cols-4 grid-cols-5 gap-x-8 sm:gap-x-3 gap-y-3 ">
        {daysOfWeek.map((day: any) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <div
              key={day.value}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleDay(day.value)}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-5 h-5 flex hidden sm:block items-center justify-center rounded-sm border transition-all
                  ${
                    isSelected
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-400 text-gray-500"
                  }`}
              >
                {isSelected ? "✓" : "-"}
              </div>
              {/* Day Label */}
              <span
                className={`border px-4 py-[6px] h-[35px] rounded-md transition-all flex items-center text-[14px] w-[60px]
                  ${
                    isSelected
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-400 text-black"
                  }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <FormSpanError
          css={{ customCss: errorCss ?? formErrorCss }}
          title={errorMsg}
        />
      )}
    </div>
  );
}
