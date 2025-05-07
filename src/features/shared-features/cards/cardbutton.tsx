"use client";
import React from "react";
import { Button } from "../table/components/ui/button";

import { useDispatch } from "react-redux";
import { RootState, useAppSelector } from "@/state/store";
import { IdCard, Sheet } from "lucide-react";
import { setCustomerView } from "@/state/admin/AdminSlice";

const CardButton = () => {
  const dispatch = useDispatch();
  const { view } = useAppSelector(
    (state: RootState) => state.admin.admin.user?.viewType
  );
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => dispatch(setCustomerView(!view))}
    >
      {view ? (
        <Sheet className="mr-2 size-4" />
      ) : (
        <IdCard className="mr-2 size-5" />
      )}
      {view ? "Card" : "Table"} View
    </Button>
  );
};

export default CardButton;
