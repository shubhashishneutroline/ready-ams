"use client";
import CustomerPageHeader from "@/features/customer/components/customerpageheader";

import { usersData } from "@/features/shared-features/table/data";
import React from "react";
import {
  UserColumns,
  columns,
} from "../../../features/shared-features/table/columns";
import { CustomerDataTable } from "@/features/shared-features/table/data-table/customerdata-table";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import CustomerCardView from "@/features/shared-features/cards/CustomerCardView";
import { retriveUsers } from "@/state/admin/AdminServices";

const page = () => {
  const { view } = useAppSelector(
    (state: RootState) => state.admin.admin.user?.viewType
  );

  // console.log("Data from Api:", details);
  return (
    <div className="w-full flex flex-col gap-4 ">
      <CustomerPageHeader />

      {view ? (
        <CustomerDataTable  columns={UserColumns} />
      ) : (
        <CustomerCardView user={usersData} />
      )}
    </div>
  );
};

export default page;
