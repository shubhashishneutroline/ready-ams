"use client"


import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import ToggleTableTabs from "./toggle-table-filter"

const TableFilterTabs = ({ onChange }: { onChange: (val: string) => void }) => {
  const form = useForm({
    defaultValues: {
      filterType: "reminder",
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
