import { serviceData } from "@/features/service/action/action"
import { columns } from "./column"
import { DataTable } from "./data-table"

export default function Table() {
  const data = serviceData
  console.log(data, "serviceData")
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
