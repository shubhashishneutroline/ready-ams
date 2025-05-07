"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { formErrorCss, formInputCss } from "./props";
import { FormSpanError } from "./error/fromspanerror";
import { getFormErrorMsg } from "@/utils/utils";
import { InputSchema } from "@/schemas/schema";
import { Controller } from "react-hook-form";

export default function InputPhone(props: InputSchema) {
  // Props
  const { common, actions, form, css } = props;
  // Props variables
  const { input, label, defaultValue, placeholder, showImportant, icon } =
    common;
  const { register, errors, control } = form;
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } =
    actions! || {};
  const { inputCss, errorCss } = css || {};

  // Values
  const errorMsg = getFormErrorMsg(errors, input);
  // Css
  const highlightBorder =
    "border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";
  const errorBorder =
    "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400";
  const border = errorMsg ? errorBorder : highlightBorder;

  // Final Css
  const finalInputCss = inputCss ?? formInputCss;

  // Error Props
  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const dropdown = document.querySelector(
      ".react-phone-input-2__list"
    ) as HTMLElement;
    if (!dropdown) return;

    const firstLetter = e.key.toUpperCase();

    // Get the list of countries from the dropdown
    const countryItems = dropdown.querySelectorAll(
      ".country"
    ) as NodeListOf<HTMLElement>;

    // Loop through the countries and scroll to the first one that matches the letter
    countryItems.forEach((item) => {
      const countryName = item.textContent?.trim() || "";
      if (countryName.toUpperCase().startsWith(firstLetter)) {
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  return (
    <div className="relative h-[75px] pt-1 flex flex-col gap-1 text-[11px] text-dark-100 w-full px-2 min-w-[150px]">
      {label && (
        <label
          className="text-black font-semibold flex gap-2 text-sm"
          htmlFor={input}
        >
          {icon && icon} {label}{" "}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Phone Input */}
      {/* Controlled Phone Input */}
      <div className="h-[10px] sm:h-[25px] lg:h-[40px] 2xl:h-[45px]">
        <Controller
          name={input}
          control={control}
          defaultValue={defaultValue ?? ""}
          render={({ field }) => (
            <PhoneInput
              {...field}
              country={"us"}
              enableSearch={true}
              countryCodeEditable={false}
              containerStyle={{ width: "100%" }}
              inputStyle={{
                width: "100%",

                padding: "10px",
                borderRadius: "7px",
                paddingLeft: "50px",
                color: "black",
                border: `1px solid ${errorMsg ? "red" : "#ccc"}`,
              }}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </div>

      {errorMsg && <FormSpanError {...errorProps} />}
    </div>
  );
}
