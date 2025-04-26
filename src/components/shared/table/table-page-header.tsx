"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TablePageHeaderProps {
  title: string;
  description: string;
  newButton: string;
  handleClick: () => void;
}

export default function TablePageHeader({
  title,
  description,
  newButton,
  handleClick,
}: TablePageHeaderProps) {
  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col">
        <div className="text-lg md:text-xl lg:text-2xl  font-semibold text-gray-700">
          {title}
        </div>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
      <div className="flex items-end justify-end">
        <Button
          type="button"
          onClick={handleClick}
          className=" bg-blue-600 hover:bg-blue-700 rounded-lg h-9.5 flex gap-1 md:gap-2"
        >
          <Plus className="h-5 w-5" />
          {newButton}
        </Button>
      </div>
    </div>
  );
}
