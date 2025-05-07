"use client";

import AddSupportAndFaq from "@/features/form-components/form-method/add/AddSupportandFAQ";
import { setAddSupportFormTrue } from "@/state/admin/AdminSlice";
import { useAppDispatch } from "@/state/store";
import React, { useEffect } from "react";

const page = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setAddSupportFormTrue(true));
  }, []);

  return <div className="w-full flex flex-col gap-4 "></div>;
};

export default page;
