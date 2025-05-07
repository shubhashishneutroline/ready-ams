"use client";

import AppointmentCardView from "@/features/shared-features/cards/AppointmentCardView";
import { AppointmentColumns } from "@/features/shared-features/table/columns";
import { usersData } from "@/features/shared-features/table/data";
import { RootState, useAppSelector } from "@/state/store";
import React from "react";
import AppointmentPageHeader from "@/features/appointment/components/appointmentpageheader";
import { AppointmentDataTable } from "@/features/shared-features/table/data-table/appointmentdata-table";

const page = () => {
  const { view } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment?.viewType
  );
  return (
    <>
      {/* <AddAppointmentForm /> */}
      <div className="w-full flex flex-col gap-4">
        <AppointmentPageHeader />
        {view ? (
          <AppointmentDataTable columns={AppointmentColumns} />
        ) : (
          <AppointmentCardView user={usersData} />
        )}
      </div>
    </>
  );
};

export default page;
