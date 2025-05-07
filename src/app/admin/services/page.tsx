"use client";

import { servicesData } from "@/features/shared-features/table/data";
import React from "react";
import { ServiceColumns } from "../../../features/shared-features/table/columns";
import { RootState, useAppSelector } from "@/state/store";
import ServicePageHeader from "@/features/service/components/servicepageheader";
import { ServiceCardView } from "@/features/shared-features/cards/ServiceCardView";
import { ServiceDataTable } from "../../../features/shared-features/table/data-table/servicedata-table";

const page = () => {
  const { view } = useAppSelector(
    (state: RootState) => state.admin.admin.user?.viewType
  );
  return (
    <div className="w-full flex flex-col gap-4 ">
      <ServicePageHeader />

      {view ? (
        <ServiceDataTable columns={ServiceColumns} />
      ) : (
        <ServiceCardView data={servicesData} />
      )}
    </div>
  );
};

export default page;
