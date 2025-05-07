"use client";
import { useState, useEffect } from "react";
import { DateInput, TimeInput } from "./dayinput";
import { formDivCss, formErrorCss, formLabelCss } from "./props";
import { getFormErrorMsg } from "@/utils/utils";
import { InputSchema } from "@/schemas/schema";
import dayjs from "dayjs";

type CheckboxOption = {
  label: string;
  value: string;
  showSchedule?: boolean;
};

interface GenericCheckboxWithScheduleProps extends InputSchema {
  options: CheckboxOption[];
  selectionType?: "single" | "multiple";
  scheduleField?: string; // e.g., "scheduledTime"
}

export const CheckboxWithSchedule = ({
  options,
  common,
  css,
  form,
  scheduleField = "scheduledTime",
  selectionType = "multiple",
}: GenericCheckboxWithScheduleProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const { input, label, icon, showImportant } = common;
  const { errors, setValue } = form;

  const errorMsg = getFormErrorMsg(errors, input);
  const finalDivCss = css?.divCss ?? formDivCss;
  const finalLabelCss = css?.labelCss ?? formLabelCss;

  const isSelected = (val: string) => selected.includes(val);

  const toggleOption = (value: string) => {
    if (selectionType === "single") {
      setSelected((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  useEffect(() => {
    const mapped = selected.map((method) => ({ method }));
    setValue(input, mapped);

    if (selected.includes("schedule")) {
      // Store date as ISO (if you want), and time as local string
      const formattedTime = dayjs(scheduleTime).format("HH:mm"); // '14:30'

      setValue(scheduleField, {
        date: scheduleDate,
        time: formattedTime,
      });
    } else {
      setValue(scheduleField, "");
    }
  }, [selected, scheduleDate, scheduleTime, input, scheduleField, setValue]);

  const hasSchedule = options.some(
    (opt) => opt.showSchedule && selected.includes(opt.value)
  );

  return (
    <div className={`${finalDivCss} ${hasSchedule ? "min-h-[212px]" : ""}`}>
      {label && (
        <label className={finalLabelCss}>
          {icon} {label}
          {showImportant && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-5 sm:gap-8 flex-wrap">
        {options.map((opt) => (
          <div
            key={opt.value}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => toggleOption(opt.value)}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-sm border transition-all ${
                isSelected(opt.value)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-400 text-gray-500"
              }`}
            >
              {isSelected(opt.value) ? "✓" : "-"}
            </div>
            <span
              className={`border px-4  sm:py-[6px] h-[35px] rounded-md transition-all flex items-center text-[12px] sm:text-[14px] ${
                isSelected(opt.value)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-400 text-black"
              }`}
            >
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      {hasSchedule && (
        <div className="flex gap-4 pt-2">
          <DateInput
            common={{
              input: `${scheduleField}.date`,
              label: "Date",
              placeholder: "Select a date",
              showImportant: true,
            }}
            form={form}
            css={{}}
            actions={{
              handleOnChange: (val: any) => setScheduleDate(val),
            }}
          />
          <TimeInput
            common={{
              input: `${scheduleField}.time`,
              label: "Time",
              placeholder: "Pick time",
              showImportant: true,
            }}
            form={form}
            css={{}}
            actions={{
              handleOnChange: (val: any) => {
                const time =
                  typeof val === "string" ? dayjs(val, "HH:mm") : dayjs(val);

                const todayWithTime = dayjs()
                  .hour(time.hour())
                  .minute(time.minute())
                  .second(0)
                  .millisecond(0);

                setScheduleTime(todayWithTime.format("HH:mm:ss"));
              },
            }}
          />
        </div>
      )}

      {errorMsg && (
        <span className={`${formErrorCss} text-red-500 pt-1 text-sm`}>
          {errorMsg}
        </span>
      )}
    </div>
  );
};
