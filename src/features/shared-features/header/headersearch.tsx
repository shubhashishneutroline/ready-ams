"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const HeaderSearch = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative h-[50px] hidden md:block">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isFocused ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-3 left-8 lg:left-4 "
      >
        <SearchRoundedIcon
          sx={{
            fontSize: {
              xs: "20px",
              sm: "25px",
              lg: "29px",
              xl: "30px",
            },
          }}
          className={`cursor-pointer ${
            isFocused ? "text-[#287AFF]" : "text-amber-50"
          }`}
          onClick={() => setIsFocused(true)} // Trigger focus on icon click
        />
      </motion.div>

      {/* Search Input Field with Framer Motion */}
      <motion.input
        type="search"
        placeholder={isFocused ? "" : "Search here.."}
        className={`h-full w-[312px] ${
          isFocused ? "bg-amber-50" : "bg-[]"
        }  rounded-[16px] placeholder:pl-14 outline-none px-4 transition-all duration-300`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== "")} // Hide input only if empty on blur
        initial={{ width: "50px", paddingLeft: "4px" }}
        animate={{
          width: isFocused ? "312px" : "58px",
          paddingLeft: isFocused ? "14px" : "",
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default HeaderSearch;
