"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ToggleTableTabs from "./toggle-table-filter";

const TableFilterTabs = () => {
  const form = useForm({
    defaultValues: {
      filterType: "all",
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
