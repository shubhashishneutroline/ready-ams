import StaffPageHeader from "@/features/customer/components/staffpageheader";
import TicketPageHeader from "@/features/customer/components/ticketpageheader";
import {
  AppointmentColumns,
  StaffColumns,
  TicketsColumns,
} from "@/features/shared-features/table/columns";
import { StaffDataTable } from "@/features/shared-features/table/data-table/staffdata-table";
import { TicketsDataTable } from "@/features/shared-features/table/data-table/ticketsdata-table";
import React from "react";

const StaffPage = () => {
  return (
    <div className="flex flex-col gap-10 w-full px-2 sm:px-20 pt-4 ">
      <div className="w-[100%] h-[53px] flex flex-col justify-start gap-4 rounded-md px-[11px]">
        <StaffPageHeader />
        <StaffDataTable columns={StaffColumns} />
      </div>
    </div>
  );
};

export default StaffPage;
