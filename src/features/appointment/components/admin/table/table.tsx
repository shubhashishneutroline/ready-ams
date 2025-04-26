import { getAppointments } from "@/features/appointment/api/api";
import { columns } from "./column";
import { DataTable } from "./data-table";

const data = await getAppointments();

export default function Table() {
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
