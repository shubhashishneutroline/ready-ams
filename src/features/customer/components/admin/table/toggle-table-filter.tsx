"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LucideIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function ToggleTableTabs({ name }: { name: string }) {
  const { watch, setValue } = useFormContext();
  const value = watch(name);

  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v: any) => v && setValue(name, v)}
        className="gap-6"
      >
        <ToggleGroupItem
          value="all"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-4"
          style={{
            boxShadow: value === "all" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          All
        </ToggleGroupItem>
        <ToggleGroupItem
          value="active"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-6"
          style={{
            boxShadow:
              value === "active" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Active
        </ToggleGroupItem>
        <ToggleGroupItem
          value="inactive"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-4"
          style={{
            boxShadow:
              value === "inactive" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Inactive
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
