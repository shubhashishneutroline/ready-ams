import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { FormPropsValueType } from "@/schemas/GlobalSchema";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

export const fullNameProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "fullName",
  label: label ?? "Full Name",
  type: type ?? "text",
  placeholder: placeholder ?? "Enter Full Name",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <PersonIcon
      className="text-[#6C757D]"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const customerNameProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "customerName",
  label: label ?? "Customer Name",
  type: type ?? "text",
  placeholder: placeholder ?? "Enter Customer Name",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <PersonIcon
      className="text-[#6C757D]"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const titleProps = ({ defaultValue }: any) => ({
  input: "title",
  label: "Service Title",
  type: "text",
  placeholder: "Enter Service Name",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <PersonIcon
      className="text-[#6C757D]"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});

export const createdByIdProps = ({
  title,
  label,
  type,
  placeholder,
  showImportant,
  icon,
  defaultValue,
}: any) => ({
  input: "createdById",
  label: "Created By",
  type: "select",
  placeholder: "Enter Your Self",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <PersonIcon
      className="text-[#6C757D]"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});

export const statusProps = ({ defaultValue }: any) => ({
  input: "status",
  label: "Status",
  type: "select",
  placeholder: "Selecte Status of Your Appointment",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <PersonIcon
      className="text-[#6C757D]"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const emailProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "email",
  label: label ?? "Email",
  type: type ?? "text",
  placeholder: placeholder ?? "Enter Email Address",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <EmailIcon
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
});
export const phoneProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "phone",
  label: label ?? "Phone Number",
  type: type ?? "phone",
  placeholder: placeholder ?? "Enter Phone Number (+9779867373778)",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <LocalPhoneIcon
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
});
export const cityProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "city",
  label: label ?? "City",
  type: type ?? "text",
  placeholder: placeholder ?? "City",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <LocalPhoneIcon
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
});
export const streetProps = ({ defaultValue }: any) => ({
  input: "street",
  label: "Street",
  type: "text",
  placeholder: "Street",
  showImportant: false,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const countryProps = ({ defaultValue }: any) => ({
  input: "country",
  label: "Country",
  type: "text",
  placeholder: "Country",
  showImportant: false,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});

export const zipCodeProps = ({ defaultValue }: any) => ({
  input: "zipCode",
  label: "Zip Code",
  type: "text",
  placeholder: "Enter your Zip Code",
  showImportant: false,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const roleProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: FormPropsValueType) => ({
  input: input ?? "role",
  label: label ?? "Role",
  type: type ?? "select",
  placeholder: placeholder ?? "Select Role",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <LocalPhoneIcon
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
});

export const reminderCheckerProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: FormPropsValueType) => ({
  input: input ?? "role",
  label: label ?? "Role",
  type: type ?? "select",
  placeholder: placeholder ?? "Select Role",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <LocalPhoneIcon
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
});

export const serviceIdProps = ({ defaultValue }: any) => ({
  input: "serviceId",
  label: "Service",
  type: "select",
  placeholder: "Select Service",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});

export const dateProps = ({ defaultValue }: any) => ({
  input: "date",
  label: "Date",
  type: "input",
  placeholder: "Select Date",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const selectedDateProps = ({ defaultValue }: any) => ({
  input: "selectedDate",
  label: "Selected Date",
  type: "input",
  placeholder: "Select Date",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const timeProps = ({ defaultValue }: any) => ({
  input: "time",
  label: "Time",
  type: "input",
  placeholder: "Select Time",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const selectedTimeProps = ({ defaultValue }: any) => ({
  input: "selectedTime",
  label: "Selected Time",
  type: "input",
  placeholder: "Select Time",
  showImportant: true,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
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
});
export const messageProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: FormPropsValueType) => ({
  input: input ?? "message",
  label: label ?? "Message",
  type: type ?? "textbox",
  placeholder: placeholder ?? "Something to tell...",
  showImportant: showImportant ?? true,
  defaultValue: defaultValue ?? "",
  icon: icon ?? (
    <LocalPhoneIcon
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
});
export const isActiveProps = ({ defaultValue }: any) => ({
  input: "isActive",
  label: "Active",
  showImportant: false,
  defaultValue: defaultValue ?? true,
  icon: (
    <LocalPhoneIcon
      className="text-black"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const isForSelfProps = ({ defaultValue }: any) => ({
  input: "isForSelf",
  label: "Is For Self",
  showImportant: true,
  defaultValue: defaultValue ?? true,
  icon: (
    <LocalPhoneIcon
      className="text-black"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const passwordProps = ({ defaultValue }: any) => ({
  input: "password",
  label: "Password",
  showImportant: true,
  placeholder: "Enter your password",

  showForgotPassword: false,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
      className="text-black"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const dayInputProps = ({ defaultValue }: any) => ({
  input: "business_days",
  label: "Business Days",
  showImportant: true,
  // placeholder: "Enter your password",
  // showForgotPassword: false,
  defaultValue: defaultValue ?? "",
  icon: (
    <LocalPhoneIcon
      className="text-black"
      sx={{
        fontSize: {
          xs: "16px",
          sm: "16px",
          lg: "18px",
        },
      }}
    />
  ),
});
export const emptyFormProps = ({
  input,
  label,
  type,
  placeholder,
  showImportant,
  defaultValue,
  icon,
}: any) => ({
  input: input ?? "",
  label: label ?? "",
  showImportant: showImportant ?? false,
  placeholder: placeholder ?? "",
  defaultValue: defaultValue ?? "",
  icon: icon ?? "",
});

export const commonActions = {
  handleClick: null,
  handleKeyUp: null,
  handleKeyDown: null,
  handleOnChange: null,
};

export const addUserBtnProps = {
  title: "Create Customer",
  type: "submit",
  css: {
    customCss:
      "px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm",
  },
};
export const addTicketBtnProps = {
  title: "Create Ticket",
  type: "submit",
  css: {
    customCss:
      "px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm",
  },
};
export const editTicketBtnProps = {
  title: "Edit Ticket",
  type: "submit",
  css: {
    customCss:
      "px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm",
  },
};
export const addAppointmentBtnProps = () => ({
  title: "Create Appointment",
  type: "submit",

  css: {
    customCss:
      "text-[11px] px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm cursor-pointer",
  },
});
export const addServiceBtnProps = () => ({
  title: "Create Service",
  type: "submit",

  css: {
    customCss:
      "text-[11px] px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm cursor-pointer",
  },
});
export const addFAQBtnProps = (handleClick: () => void) => ({
  title: "New FAQ",
  type: "button",
  handleAction: handleClick,
  css: {
    customCss:
      "px-4 py-2 flex w-[100px] gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[11px] rounded-sm cursor-pointer",
  },
});
export const newFAQBtnProps = (handleClick: () => void) => ({
  title: "Add FAQ",
  type: "button",
  handleAction: handleClick,
  css: {
    customCss:
      "text-[11px] px-4 py-2 flex gap-1 justify-center items-center  bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white  font-[600] text-[14px] rounded-sm cursor-pointer",
  },
});
export const cancelBtnProps = (handleClick: () => void) => ({
  title: "Cancel",
  type: "button",
  handleAction: handleClick,
  css: {
    customCss:
      "px-4 py-2 flex gap-1 justify-center items-center bg-gradient-to-l from-gray-500 to-gray-700 text-white font-[700] text-[14px] rounded-sm",
  },
});

export const defaultBtnProps = ({ availability, handleAction }: any) => ({
  title: "Deafult",
  type: "button",
  onClick: handleAction,
  css: {
    customCss:
      availability === "default"
        ? "px-4 py-2 flex gap-1 justify-center items-center bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white font-[700] text-[14px] rounded-sm cursor-pointer"
        : "px-4 py-2 flex gap-1 justify-center items-center bg-gray-200 text-gray-700 font-[700] text-[14px] rounded-sm cursor-pointer hover:bg-gray-300",
  },
});
export const customBtnProps = ({ availability, handleAction }: any) => ({
  title: "Custom",
  type: "button",
  onClick: handleAction,
  css: {
    customCss:
      availability === "cancel"
        ? "px-4 py-2 flex gap-1 justify-center items-center bg-gradient-to-b from-[#2B73FF] to-[#038FFF] text-white font-[700] text-[14px] rounded-sm cursor-pointer"
        : "px-4 py-2 flex gap-1 justify-center items-center bg-gray-200 text-gray-700 font-[700] text-[14px] rounded-sm cursor-pointer hover:bg-gray-300",
  },
});
