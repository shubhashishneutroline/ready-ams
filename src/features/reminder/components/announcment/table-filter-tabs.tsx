"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import ToggleTableTabs from "./toggle-table-filter"

const TableFilterTabs1 = ({ onChange }: { onChange: (val: string) => void }) => {
  const form = useForm({
    defaultValues: {
      filterType: "sent",
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

export default TableFilterTabs1
