"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  FilePenLine,
  Trash2,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getServices } from "@/features/service/api/api";
import { useEffect, useState } from "react";
import { deleteAppointment } from "@/features/appointment/api/api";

// Define the type for a payment
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Service cell component to handle async data fetching
const ServiceCell = ({ serviceId }: { serviceId: string }) => {
  const [serviceName, setServiceName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchService = async () => {
      const services = await getServices();
      const service = services?.find((s: any) => s.id === serviceId);
      setServiceName(service?.title || "N/A");
    };
    fetchService();
  }, [serviceId]);

  return <div>{serviceName}</div>;
};

// Define columns for the payment table
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      if (!phone) return null;

      // Format as +977 986-137-8912
      const formatted = phone.replace(
        /^(\+\d{3})(\d{3})(\d{3})(\d{4})$/,
        "$1 $2-$3-$4"
      );
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "serviceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    cell: ({ row }) => {
      return <ServiceCell serviceId={row.original.serviceId} />;
    },
  },

  {
    accessorKey: "selectedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("selectedDate"));
      return <div>{format(date, "dd MMMM yyyy")}</div>;
    },
  },
  {
    accessorKey: "selectedTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      const time = new Date(row.getValue("selectedTime"));
      return <div>{format(time, "hh:mm a")}</div>;
    },
  },

  {
    id: "actions",
    // Actions dropdown for each row
    cell: ({ row }) => {
      const router = useRouter();
      // Return the actions dropdown menu for each payment row
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="flex gap-2 items-center justify-start">
              Action
              <Settings className="h-4 w-4" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* View payment action */}
            <DropdownMenuItem
              onClick={() =>
                router.push(`/appointment/view/${row.original.id}`)
              }
              className="flex gap-2 items-center justify-start"
            >
              <Eye className="h-4 w-4 text-blue-400" /> View
            </DropdownMenuItem>
            {/* Edit payment action */}
            <DropdownMenuItem
              onClick={() =>
                router.push(`/appointment/edit/${row.original.id}`)
              }
              className="flex gap-2 items-center justify-start"
            >
              <FilePenLine className="h-4 w-4 text-green-600" /> Edit
            </DropdownMenuItem>
            {/* Delete payment action */}
            <DropdownMenuItem
              onClick={() => deleteAppointment(row.original)}
              className="flex gap-2 items-center justify-start"
            >
              <Trash2 className="h-4 w-4 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
