import { getAppointments } from "@/features/appointment/api/api";
import { columns, Payment } from "./column";
import { DataTable } from "./data-table";

export default async function Table() {
  const data = await getAppointments();
  console.log(data, "data");

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
