"use client";

import ToggleTableTabs from "@/components/shared/toggle-table-filter";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

const TableFilterTabs = () => {
  const form = useForm({
    defaultValues: {
      filterType: "today",
    },
  });

  // Watch the selected value directly in the parent component
  const selectedFilterType = form.watch("filterType");

  // Log the selected value whenever it changes
  useEffect(() => {
    console.log("Selected filter type:", selectedFilterType);
  }, [selectedFilterType]);

  return (
    <FormProvider {...form}>
      <form>
        <ToggleTableTabs name="filterType" />
      </form>
    </FormProvider>
  );
};

export default TableFilterTabs;
