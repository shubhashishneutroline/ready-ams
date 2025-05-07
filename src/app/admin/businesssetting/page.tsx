"use client";

import React, { useEffect } from "react";

import { useAppDispatch } from "@/state/store";

import { setAddBusinessDetailTrue } from "@/state/admin/AdminSlice";

const page = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setAddBusinessDetailTrue(true));
  }, []);

  return <div className="w-full flex flex-col gap-4 "></div>;
};

export default page;
