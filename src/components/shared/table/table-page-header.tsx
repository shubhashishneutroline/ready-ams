import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TablePageHeader() {
  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col">
        <div className="text-lg md:text-xl lg:text-2xl  font-semibold text-gray-700">
          Appointments
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Manage and view all appointment requests
        </p>
      </div>
      <div className="flex items-end justify-end">
        <Button
          type="button"
          className=" bg-blue-600 hover:bg-blue-700 rounded-xl h-9.5 flex gap-1 md:gap-2"
        >
          <Plus className="h-5 w-5" />
          New Appointment
        </Button>
      </div>
    </div>
  );
}
