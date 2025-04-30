"use client"

import ToggleTableTabs from "@/components/shared/table/toggle-table-filter"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"

const TableFilterTabs = ({ onChange }: { onChange: (val: string) => void }) => {
  const form = useForm({
    defaultValues: {
      filterType: "today",
    },
  })

  const selectedFilterType = form.watch("filterType")

  useEffect(() => {
    onChange(selectedFilterType)
  }, [selectedFilterType, onChange])

  return (
    <FormProvider {...form}>
      <form>
        <ToggleTableTabs name="filterType" />
      </form>
    </FormProvider>
  )
}

export default TableFilterTabs
