"use client";
import TableFilterTabs from "@/components/shared/table/table-filter-tabs";
import TablePageHeader from "@/components/shared/table/table-page-header";
import { announcementColumns } from "@/features/reminder/components/announcment/columns";
import { DataTable } from "@/features/reminder/components/reminder/data-table";

import React from "react";

const CustomerTickerPage = () => {
  return (
    <div>
      <>
        <TableFilterTabs />
        <TablePageHeader
          title="Announcement"
          description="Manage and Customize your business"
        />
        <DataTable columns={announcementColumns} data={announcementData} />
      </>
    </div>
  );
};

export default CustomerTickerPage;
