/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { InputSchema } from "@/schemas/schema";
import { getFormErrorMsg } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";
import { FormSpanError } from "./error/fromspanerror";
import {
  formDivCss,
  formDivIconCss,
  formLabelCss,
  formInputCss,
  formErrorCss,
} from "./props";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordInput(props: InputSchema) {
  // Props
  const { common, actions, form, css } = props;

  // Props variables
  const {
    input,
    label,
    defaultValue,
    placeholder,
    icon,
    showForgotPassword,
    showImportant,
  } = common;
  const { register, errors } = form;
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } = actions!;
  const { divCss, labelCss, inputCss, errorCss, iconCss } = css!;

  // States
  const [show, setShow] = useState<boolean>(false);

  // Values
  const errorMsg = getFormErrorMsg(errors, input);

  // Css
  const highlightBorder =
    "border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";
  const errorBorder =
    "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400";
  const border = errorMsg ? errorBorder : highlightBorder;

  // Final css
  const finalDivCss = divCss ?? formDivCss;
  const finalIconCss = iconCss ?? formDivIconCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = inputCss ?? formInputCss;

  // Error Props
  // const labelErrorProps = { css: {}, title: "*" };
  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  return (
    <div className={finalDivCss}>
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
          {showForgotPassword && (
            <Link href="/forgot-password">
              <span className="text-new-blue-700">Forgot Password?</span>
            </Link>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={input}
          {...register(input)}
          className={`${finalInputCss} ${border} w-full pr-10`} // Added padding-right to make room for the icon
          type={show ? "text" : "password"}
          placeholder={placeholder}
          key={input}
          defaultValue={defaultValue ?? ""}
          onClick={handleClick}
          onChange={handleOnChange}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />

        {/* Eye Icon */}
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {!show ? (
            <VisibilityIcon sx={{ color: "gray", fontSize: "18px" }} />
          ) : (
            <VisibilityOffIcon sx={{ color: "gray", fontSize: "18px" }} />
          )}
        </div>
      </div>
      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}
