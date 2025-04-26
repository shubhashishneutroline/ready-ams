"use client";

import React from "react";
import TableFilterTabs from "@/components/shared/table/table-filter-tabs";
import Table from "@/features/appointment/components/admin/table/table";
import TablePageHeader from "@/components/shared/table/table-page-header";
import { useRouter } from "next/navigation";

const AppointmentPage = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto flex flex-col gap-6">
      <TableFilterTabs />
      <TablePageHeader
        title="Appointment"
        description="Manage and Customize Appointment Here."
        newButton="New Appointment"
        handleClick={() => {
          router.push("/appointment/create/");
        }}
      />
      <Table />
    </div>
  );
};

export default AppointmentPage;
