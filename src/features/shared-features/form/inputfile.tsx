import { InputSchema } from "@/schemas/schema";
import {
  formFileDivCss,
  formFileInputCss,
  formErrorCss,
  formLabelCss,
} from "./props";
import { FormSpanError } from "./error/fromspanerror";
import { getFormErrorMsg } from "@/utils/utils";

export default function FileInput(props: InputSchema) {
  const { common, form, css } = props;
  const { input, label, showImportant, icon } = common;
  const { register, errors, trigger } = form;
  const { divCss, labelCss, errorCss } = css || {};

  const errorMsg = getFormErrorMsg(errors, input);
  const border = errorMsg
    ? "border border-red-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
    : "border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const finalDivCss = divCss ?? formFileDivCss;
  const finalLabelCss = labelCss ?? formLabelCss;
  const finalInputCss = formFileInputCss;

  const errorProps = {
    css: { customCss: errorCss ?? formErrorCss },
    title: errorMsg,
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await trigger(input);
  };

  return (
    <div className={`${finalDivCss} px-2 min-w-[150px]`}>
      {label && (
        <label className={finalLabelCss} htmlFor={input}>
          {icon && icon} {label}
          {showImportant && <span className="text-red-400">*</span>}
        </label>
      )}

      <input
        id={input}
        {...(register && register(input))}
        type="file"
        className={`${finalInputCss} ${border}`}
        onChange={handleInputChange}
      />

      {/* Future file UI tips */}
      <div className="text-sm text-gray-600 pt-1 pl-1">
        Accepted formats: <strong>.jpg, .png, .pdf</strong>
      </div>

      <div className="-translate-y-17">
        {errorMsg && <FormSpanError {...errorProps} />}
      </div>
    </div>
  );
}
