"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import ToggleTableTabs from "./toggle-table-filter"

const TableFilterTabs = ({ onChange }: { onChange: (val: string) => void }) => {
  const form = useForm({
    defaultValues: {
      filterType: "active",
    },
  })

  // Watch the selected value directly in the parent component
  const selectedFilterType = form.watch("filterType")

  // Log the selected value whenever it changes
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
