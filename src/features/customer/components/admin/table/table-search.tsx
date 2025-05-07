import { Input } from "@/components/ui/input"
import { capitalizeFirstChar } from "@/utils/utils"
import { Table } from "@tanstack/react-table"

export interface DataTableSearchProps<TData> {
  table: Table<TData>
  name: string
}
export default function TableSearch<TData>({
  table,
  name,
}: DataTableSearchProps<TData>) {
  return (
    <Input
      placeholder={`Search by ${capitalizeFirstChar(name)} . . .`}
      value={(table.getColumn(name)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(name)?.setFilterValue(event.target.value)
      }
      className="max-w-xs sm:max-w-sm rounded-md h-8 md:h-9 text-sm md:text-md"
    />
  )
}
