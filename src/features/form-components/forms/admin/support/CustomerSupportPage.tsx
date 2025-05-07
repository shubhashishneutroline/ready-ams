import TicketPageHeader from "@/features/customer/components/ticketpageheader";
import { TicketsColumns } from "@/features/shared-features/table/columns";
import { TicketsDataTable } from "@/features/shared-features/table/data-table/ticketsdata-table";
import React from "react";

const CustomerSupportPage = () => {
  return (
    <div className="flex flex-col gap-10 px-3 sm:px-20 pt-4 w-full">
      <div className="bg-[#F4F8FF] h-[40px] sm:h-[53px] flex items-center gap-3 sm:gap-8 rounded-md px-[11px] ">
        <div className=" flex px-2 sm:px-8 items-center h-[28px] font-[500] text-[14px] tracking-[-2%] spacing-[30px] rounded-md bg-[#BED3F8]">
          Today
        </div>
        <div className="flex px-2 sm:px-8 items-center h-[28px] font-[500] text-[14px] tracking-[-2%] spacing-[30px] rounded-md bg-[#BED3F8]">
          Resolved
        </div>
        <div className="flex px-2 sm:px-8 items-center h-[28px] font-[500] text-[14px] tracking-[-2%] spacing-[30px] rounded-md bg-[#BED3F8]">
          Pending
        </div>
        <div className="flex px-2 sm:px-8 items-center h-[28px] font-[500] text-[14px] tracking-[-2%] spacing-[30px] rounded-md bg-[#BED3F8]">
          Expired
        </div>
        <div className="flex px-2 sm:px-8 items-center h-[28px] font-[500] text-[14px] tracking-[-2%] spacing-[30px] rounded-md bg-[#BED3F8]">
          All
        </div>
      </div>
      <div>
        <TicketPageHeader />
        <TicketsDataTable columns={TicketsColumns} />
      </div>
    </div>
  );
};

export default CustomerSupportPage;
