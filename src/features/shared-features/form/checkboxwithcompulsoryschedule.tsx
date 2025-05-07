"use client";
import { useState, useEffect } from "react";
import { DateInput, TimeInput } from "./dayinput";
import { formDivCss, formErrorCss, formLabelCss } from "./props";
import { getFormErrorMsg } from "@/utils/utils";
import { InputSchema } from "@/schemas/schema";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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

export const CheckboxWithCompulsorySchedule = ({
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
      setValue(scheduleField, {
        date: scheduleDate,
        time: scheduleTime,
      });
    } else {
      setValue(scheduleField, null);
    }
  }, [selected, scheduleDate, scheduleTime, input, scheduleField, setValue]);

  return (
    <div className={`${finalDivCss}  min-h-[160px] px-4 space-y-2`}>
      {label && (
        <label className={finalLabelCss}>
          {icon} {label}
          {showImportant && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-8 flex-wrap">
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
              className={`border px-4 py-[6px] h-[35px] rounded-md transition-all flex items-center text-[14px] ${
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

      <div className="w-full flex justify-center">
        <div className="flex gap-4 w-8/12">
          <TimeInput
            common={{
              input: `${scheduleField}.startTime`,
              label: "Start",
              placeholder: "Select a time",
              showImportant: true,
              icon: (
                <AccessTimeIcon
                  className="text-[#6C757D]"
                  sx={{
                    fontSize: {
                      xs: "16px",
                      sm: "16px",
                      lg: "16px",
                    },
                  }}
                />
              ),
            }}
            form={form}
            css={{}}
            actions={{
              handleOnChange: (val: any) => setScheduleTime(val),
            }}
          />
          <TimeInput
            common={{
              input: `${scheduleField}.endTime`,
              label: "End",
              placeholder: "Select a time",
              showImportant: true,
              icon: (
                <AccessTimeIcon
                  className="text-[#6C757D]"
                  sx={{
                    fontSize: {
                      xs: "16px",
                      sm: "16px",
                      lg: "16px",
                    },
                  }}
                />
              ),
            }}
            form={form}
            css={{}}
            actions={{
              handleOnChange: (val: any) => setScheduleTime(val),
            }}
          />
        </div>
      </div>

      {errorMsg && (
        <span className={`${formErrorCss} text-red-500 pt-1 text-sm`}>
          {errorMsg}
        </span>
      )}
    </div>
  );
};
