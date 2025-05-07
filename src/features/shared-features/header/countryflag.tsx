import React from "react";
import * as Flags from "country-flag-icons/react/3x2"; // Import all flags as a namespace
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

interface CountryFlagProps {
  countryCode: string; // ISO 3166-1 alpha-2 country code (e.g., 'US', 'IN')
  size?: number; // Optional size prop
}

// Type for all the available flag components
type FlagComponents = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  size = 35,
}) => {
  // Dynamically access the flag using the country code (e.g., 'US', 'IN')
  const FlagComponent = (Flags as FlagComponents)[countryCode.toUpperCase()];

  if (!FlagComponent) {
    return <div>Flag not found</div>; // In case the flag for the country code does not exist
  }

  return (
    <div className=" justify-between gap-4 items-center hidden lg:flex">
      <div
        style={{
          display: "inline-block",
          width: "20px",
          height: "20px",
          borderRadius: "60%",
          overflow: "hidden",
        }}
      >
        <FlagComponent
          style={{
            width: size,
            height: size,
            marginTop: "-5px",
            marginLeft: "-4px",
          }}
        />
      </div>
      <span className="flex items-center gap-2">
        <span className="text-white font-semibold text-[16px]">
          Eng ({`${countryCode.toUpperCase()}`})
        </span>
        <KeyboardArrowDownRoundedIcon
          className="text-white"
          sx={{
            fontSize: {
              sm: "23px",
              lg: "25px",
              xl: "30px",
            },
            padding: "0px",
          }}
        />
      </span>
    </div>
  );
};

export default CountryFlag;
