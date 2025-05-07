"use client";
import { useState, useEffect } from "react";
import { InputSchema, SelectInputSchema } from "@/schemas/schema";
import { DateInput, TimeInput } from "./dayinput";
import { formDivCss, formErrorCss, formInputCss, formLabelCss } from "./props";
import { getFormErrorMsg } from "@/utils/utils";
import dayjs from "dayjs";

export const ReminderCheckboxes = (props: SelectInputSchema) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [reminderDate, setReminderDate] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("");

  const { common, actions, form, css, options } = props;
  const { input, label, showImportant, icon, type } = common;
  const { errors, setValue } = form;

  const errorMsg = getFormErrorMsg(errors, input);

  const finalDivCss = css?.divCss ?? formDivCss;
  const finalLabelCss = css?.labelCss ?? formLabelCss;
  const finalInputCss = css?.inputCss ?? formInputCss;

  const isSelected = (value: string) => selected.includes(value);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // 🔁 Update final reminderOffset structure
  useEffect(() => {
    const sendBeforeValue =
      type === "REMINDER" || type === "CANCELLATION" ? true : false;

    const reminderOffset = selected
      .map((sel) => {
        const opt = options.find((o) => o.value === sel);

        if (!opt) return null;

        if (sel === "schedule") {
          if (!reminderDate || !reminderTime) return null;

          const datetime = dayjs(
            `${reminderDate}T${reminderTime}`
          ).toISOString();

          return {
            sendOffset: 30, // default for schedule
            sendBefore: sendBeforeValue,
          };
        }
        return {
          sendOffset: opt.offset,
          sendBefore: sendBeforeValue,
        };
      })
      .filter(Boolean);
    setValue("reminderOffset", reminderOffset);
  }, [selected, reminderDate, reminderTime, setValue]);

  return (
    <div
      className={`${finalDivCss} ${
        isSelected("schedule") ? "min-h-[212px]" : ""
      } min-h-[118px]`}
    >
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="grid grid-cols-2 gap-2">
        {options?.map((opt: any) => (
          <div
            key={opt.value}
            className="cols-span-1 flex items-center space-x-2 cursor-pointer"
            onClick={() => toggleOption(opt.value)}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-sm border transition-all
                ${
                  isSelected(opt.value)
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-400 text-gray-500"
                }`}
            >
              {isSelected(opt.value) ? "✓" : "-"}
            </div>
            <span
              className={`border px-4 py-[6px] h-[35px] rounded-md transition-all flex items-center text-[14px]
                ${
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

      {isSelected("schedule") && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-1">
            <DateInput
              common={{
                input: "reminderDate",
                label: "Reminder Date",
                placeholder: "Select a date",
                showImportant: true,
              }}
              form={form}
              css={{}}
              actions={{
                handleOnChange: (value: string) => setReminderDate(value),
              }}
            />
          </div>
          <div className="col-span-1">
            <TimeInput
              common={{
                input: "reminderTime",
                label: "Reminder Time",
                placeholder: "Pick time",
                showImportant: true,
              }}
              form={form}
              css={{}}
              actions={{
                handleOnChange: (value: string) => setReminderTime(value),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
