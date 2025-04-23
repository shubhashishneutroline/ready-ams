import React from "react";
import TableFilterTabs from "@/components/shared/table/table-filter-tabs";
import Table from "@/features/appointment/components/admin/table/table";
import TablePageHeader from "@/components/shared/table/table-page-header";

const AppointmentPage = () => {
  return (
    <div className="container mx-auto flex flex-col gap-6">
      <TableFilterTabs />
      <TablePageHeader />
      <Table />
    </div>
  );
};

export default AppointmentPage;
