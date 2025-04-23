import React from "react";

import TableFilterTabs from "@/features/appointment/components/admin/table/table-filter-tabs";

// TODO: List / Table of appointments
const AppointmentPage = () => {
  // tabs state

  // tabs handlers based on the active tab
  // const onSubmit = (data: any) => {
  //   console.log(data, "data");

  // };

  // base on the active tab render the corresponding content
  return (
    <div>
      <TableFilterTabs />
    </div>
  );
};

export default AppointmentPage;
