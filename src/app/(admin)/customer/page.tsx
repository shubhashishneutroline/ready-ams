import React from "react";

import Table from "@/features/customer/components/admin/table/table";
import TableFilterTabs from "@/features/customer/components/admin/table/table-filter-tabs";
import TablePageHeader from "@/features/customer/components/admin/table/table-page-header";


const CustomerPage = () => {
  return (
    <div className="container mx-auto flex flex-col gap-6">
      <TableFilterTabs />
      <TablePageHeader />
      <Table />
    </div>
  );
};

export default CustomerPage;
