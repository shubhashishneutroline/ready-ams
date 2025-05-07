import { ButtonSchema } from "@/schemas/schema";
import { formButtonCss } from "../form/props";
import Spinner from "./spinner";

export default function Button(props: ButtonSchema) {
  // Props
  const { title, handleAction, css, isFlag, icon } = props;
  const { customCss, iconCss } = css;
  // Props variables

  const onClick = handleAction && handleAction;
  const className = customCss ?? formButtonCss;

  // Props
  const buttonProps = { onClick, className };

  return (
    <>
      {isFlag ? (
        <button {...{ className }}>
          <Spinner isFlag />
        </button>
      ) : (
        <button {...buttonProps} type="submit">
          {icon && <div className={iconCss}>{icon}</div>}
          {title}
        </button>
      )}
    </>
  );
}
