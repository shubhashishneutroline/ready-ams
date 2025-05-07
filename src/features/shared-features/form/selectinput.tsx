import { useState, useEffect } from "react";
import { SelectInputSchema } from "@/schemas/schema";
import { getFormErrorMsg } from "@/utils/utils";
import { FormSpanError } from "./error/fromspanerror";
import { formInputCss, formErrorCss, formDivCss, formLabelCss } from "./props";

export default function CustomSelectInput(props: SelectInputSchema) {
  const { common, actions, form, css, options, multiple } = props;
  const { input, label, defaultValue, placeholder, showImportant, icon } =
    common;
  const { register, setValue, errors } = form;
  const { handleClick, handleKeyUp, handleKeyDown } = actions || {};
  const { divCss, labelCss, errorCss } = css || {};

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : []
  );

  const errorMsg = getFormErrorMsg(errors, input);
  const finalDivCss = divCss ?? formDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const border = errorMsg
    ? "border border-red-400 focus:outline-none focus:ring-red-400"
    : "border focus:outline-none focus:ring-sky-500";

  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const toggleSelect = (value: string) => {
    let updated: string[] = [];

    if (multiple) {
      updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
    } else {
      updated = [value];
      setOpen(false);
    }

    setSelected(updated);
    setValue(input, multiple ? updated : updated[0]);
  };
  const getLabelFromValue = (value: string) =>
    options?.find((opt) => opt.value === value)?.label || value;
  useEffect(() => {
    // Initialize form field value
    setValue(input, multiple ? selected : selected[0] || "");
  }, []);

  return (
    <div className={`${finalDivCss}`}>
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full bg-white px-4 py-2 rounded-md cursor-pointer ${border}`}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClickCapture={handleClick}
      >
        {selected.length === 0
          ? placeholder || "Select an option"
          : multiple
          ? selected.map((v) => getLabelFromValue(v)).join(", ")
          : getLabelFromValue(selected[0])}
      </div>
      {open && (
        <div className="border top-20 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto absolute w-full">
          {options?.map((opt: any, idx) => {
            const isChecked = selected.includes(opt.value);
            return (
              <div
                key={idx}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleSelect(opt.value)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={isChecked}
                    readOnly
                  />
                )}
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Register hidden input for react-hook-form */}
      <input type="hidden" {...register(input)} />

      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}
