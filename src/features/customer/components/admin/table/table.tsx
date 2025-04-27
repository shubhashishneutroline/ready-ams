import { Customer, getCustomers } from "@/features/customer/api/api"
import { columns } from "./column"
import { DataTable } from "./data-table"
import { customerData } from "@/features/customer/action/action"

export default function Table() {
  const data = customerData

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
