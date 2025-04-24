import { columns } from "./column";
import { DataTable } from "./data-table";
import { getServices } from "../../../api/api";

export default async function Table() {
  const data = await getServices();

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
