import { InputSchema } from "@/schemas/schema";
import {
  formDivCss,
  formErrorCss,
  formFileDivCss,
  formFileInputCss,
  formInputCss,
  formLabelCss,
  formTextBoxCss,
  formTextBoxDivCss,
} from "./props";
import { FormSpanError } from "./error/fromspanerror";
import { getFormErrorMsg } from "@/utils/utils";

export default function TextInput(props: InputSchema) {
  // Props
  const { common, actions, form, css } = props;
  // Props variables
  const { input, label, defaultValue, placeholder, showImportant, icon, type } =
    common;

  const { register, errors, trigger } = form; // Include trigger
  const { handleClick, handleKeyUp, handleKeyDown, handleOnChange } =
    actions! || {};
  const { divCss, labelCss, inputCss, errorCss } = css || {};

  // Values
  const errorMsg = getFormErrorMsg(errors, input);

  // Determine the correct CSS based on input type
  const formInputCss1: string =
    type === "textbox" ? formTextBoxCss : formInputCss;

  const formDivCss1: string =
    type === "textbox" ? formTextBoxDivCss : formDivCss;

  // Css
  const highlightBorder =
    "border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const errorBorder =
    "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400";
  const border = errorMsg ? errorBorder : highlightBorder;

  // Final Css
  const finalDivCss = divCss ?? formDivCss1;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = inputCss ?? formInputCss1;

  // Error Props
  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  // Handle input change
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Trigger validation for the specific field
    await trigger(input); // Trigger validation

    // Call custom onChange handler if provided
    if (handleOnChange) {
      handleOnChange(e);
    }
  };

  return (
    <div className={`${finalDivCss} px-2 min-w-[150px]`}>
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Render for different input types */}

      {type === "textbox" ? (
        <input
          id={input}
          {...(register && register(input))}
          className={`${formInputCss} ${border} ${finalInputCss}`}
          type="text"
          placeholder={placeholder}
          key={input}
          defaultValue={defaultValue ?? ""}
          onClick={handleClick}
          onChange={handleInputChange} // Trigger validation on change
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <input
          id={input}
          {...(register && register(input))}
          className={`${formInputCss} ${border} ${finalInputCss}`}
          type={type} // Can be "text", "email", etc.
          placeholder={placeholder}
          key={input}
          defaultValue={defaultValue ?? ""}
          onClick={handleClick}
          onChange={handleInputChange} // Trigger validation on change
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />
      )}

      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}
