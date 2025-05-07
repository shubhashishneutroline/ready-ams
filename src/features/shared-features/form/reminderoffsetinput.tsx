import { InputSchema } from "@/schemas/schema";
import { getFormErrorMsg } from "@/utils/utils";
import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Switch from "@mui/material/Switch";
import {
  formTextBoxCss,
  formInputCss,
  formDivCss,
  formLabelCss,
  formErrorCss,
  formSmallInputCss,
} from "./props";

const ReminderOffsetInput = (props: InputSchema) => {
  const { common, actions, form, css } = props;
  const { input, label, showImportant, icon, type } = common;
  const { register, errors, control, setValue, getValues } = form;
  const { divCss, labelCss, inputCss, errorCss } = css || {};
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } =
    actions! || {};
  const errorMsg = getFormErrorMsg(errors, input);

  const formInputCss1: string =
    type === "textbox" ? formTextBoxCss : formSmallInputCss;
  const border = errorMsg
    ? "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
    : "border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = inputCss ?? formInputCss1;

  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "reminderOffset",
  });

  // Make sure at least one field always renders
  useEffect(() => {
    const current = getValues("reminderOffset");
    if (!current || current.length === 0) {
      append({ sendOffset: 30, scheduledAt: "", sendBefore: true });
    }
  }, [append, getValues]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      {fields.map((field, index) => {
        const isChecked = getValues(`${input}.${index}.sendBefore`);
        const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(`${input}.${index}.sendBefore`, e.target.checked);
        };
        return (
          <div key={field.id} className="flex flex-col gap-3 text-black">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-semibold flex gap-2 text-xs sm:text-sm lg:text-sm px-2 text-gray-400 items-center">
                  Send Offset (in minutes)
                </label>
                <input
                  type="number"
                  {...register(`${input}.${index}.sendOffset`)}
                  className={`${formInputCss} ${border} ${finalInputCss}`}
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="font-semibold flex gap-2 text-xs sm:text-sm lg:text-sm px-2 text-gray-400 items-center">
                  Scheduled At
                </label>
                <input
                  type="datetime-local"
                  {...register(`${input}.${index}.scheduledAt`)}
                  className={`${formInputCss} ${border} ${finalInputCss}`}
                />
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-2/3">
                <label className="font-semibold flex gap-2 text-xs sm:text-sm lg:text-sm px-2 text-gray-400 items-center">
                  Send Before
                </label>
                <div className="flex items-center h-[40px] sm:h-[35px] lg:h-[40px] 2xl:h-[45px] space-x-2">
                  <span className="text-sm text-gray-600">Before</span>

                  <Switch
                    id={`${input}.${index}.sendBefore`}
                    checked={isChecked}
                    onChange={(e) =>
                      setValue(`${input}.${index}.sendBefore`, e.target.checked)
                    }
                    onClick={handleClick}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    className={`bg-[#F8F9FA] rounded-md text-black border border-gray-400 ${finalInputCss}`}
                  />

                  <span className="text-sm text-gray-600">After</span>
                </div>
              </div>
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 flex items-center justify-center mt-2 sm:mt-6"
              >
                -
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({ sendOffset: 30, scheduledAt: "", sendBefore: true })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-fit text-sm flex items-center gap-2"
      >
        +
      </button>
    </div>
  );
};

export default ReminderOffsetInput;
