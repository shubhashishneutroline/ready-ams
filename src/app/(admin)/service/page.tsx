import React from "react";

import Table from "@/features/service/components/admin/table/table";
import TableFilterTabs from "@/features/service/components/admin/table/table-filter-tabs";
import TablePageHeader from "@/features/service/components/admin/table/table-page-header";

const ServicePage = () => {
  // fetch data in the server

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <TableFilterTabs />
      <TablePageHeader />
      <Table />
    </div>
  );
};

export default ServicePage;
