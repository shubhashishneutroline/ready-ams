"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "./data-table-column-header";
import { CustomerDataTableRowActions } from "./datatable-row-actions/customerdatatable-row-actions";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./components/ui/checkbox";
import { Appointment, Expense, User } from "./schemas";
import { Button } from "./components/ui/button";
import Tooltip from "@mui/material/Tooltip";
import { AppointmentDataTableRowActions } from "./datatable-row-actions/appointmentdatatable-row-actions";
import { capitalizeFirstChar } from "@/utils/utils";
import { ServiceDataTableRowActions } from "./datatable-row-actions/servicedatatable-row-actions";
import { Ticket } from "@/features/ticket/types/types";
import { StaffDataTableRowActions } from "./datatable-row-actions/staffdatatable-row-actions";
import { TicketDataTableRowActions } from "./datatable-row-actions/ticketdatatable-row-actions";
import { NotificationDataTableRowActions } from "./datatable-row-actions/notificationdatatable-row-action";
const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-blue-500/70";
    case "superadmin":
      return "bg-gray-500/70";
    case "user":
      return "bg-green-500/70";
  }
};

export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("label")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("note")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("category")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className="flex w-[100px] items-center">
          {type === "income" ? (
            <TrendingUp size={20} className="mr-2 text-green-500" />
          ) : (
            <TrendingDown size={20} className="mr-2 text-red-500" />
          )}
          <span className="capitalize"> {row.getValue("type")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              "capitalize",
              type === "income" ? "text-green-500" : "text-red-500"
            )}
          >
            {" "}
            {row.getValue("amount")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomerDataTableRowActions row={row} />,
  },
];

export const UserColumns: ColumnDef<User>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
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
  },
  // {
  //   accessorKey: "dateOfBirth",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Date of Birth" />
  //   ),
  //   cell: ({ row }) => format(new Date(row.original.dateOfBirth), "PPP"),
  // },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");

      return (
        <span
          className={`  gap-3 py-[5px] sm:py-1.5 w-[70px] sm:min-w-[120px] flex items-center justify-center rounded-full text-[12px] sm:text-[14px] font-medium ${
            isActive
              ? "bg-[#ECFDF3] text-[#649C68]"
              : "bg-[#FDF9EC] text-[#B57200]"
          }`}
        >
          <div
            className={`h-[5px] sm:h-[6px] w-[5px] sm:w-[6px] ${
              isActive ? "bg-[#649C68]" : "bg-[#B57200]"
            } rounded-full`}
          ></div>
          <>{isActive ? "Active" : "Inactive"}</>
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role: string = row.getValue("role");

      return (
        <span
          className={` py-1 w-[80px] sm:min-w-[135px] text-center inline-block rounded-full text-white text-[12px] sm:text-sm font-medium ${getRoleBadgeStyle(
            role.toLocaleLowerCase()
          )}`}
        >
          {capitalizeFirstChar(role.toLocaleLowerCase())}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    accessorKey: "lastActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Active" />
    ),
    cell: ({ row }) => format(new Date(row.original.lastActive), "PPP"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomerDataTableRowActions row={row} />,
  },
];

export const AppointmentColumns: ColumnDef<Appointment>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
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
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => row.original.service?.title || "N/A",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusStyles: Record<string, string> = {
        ACTIVE: "bg-green-500/70",
        SCHEDULED: "bg-blue-500/70",
        MISSED: "bg-red-500/70",
        CANCELLED: "bg-gray-500/70",
        COMPLETED: "bg-green-500/70",
      };

      return (
        <span
          className={`px-4 py-1.5 rounded-full text-white text-sm font-medium ${
            statusStyles[status] || "bg-zinc-400/60"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number " />
    ),
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "bookedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Booked By " />
    ),
    cell: ({ row }) => row.original.user?.name || "N/A",
  },
  // {
  //   accessorKey: "dateOfBirth",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Date of Birth" />
  //   ),
  //   cell: ({ row }) => format(new Date(row.original.dateOfBirth), "PPP"),
  // },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      const message = row.getValue("message") as string;

      return (
        <Tooltip title={message} placement="top" arrow>
          <div className="max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
            {message}
          </div>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "selectedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.original.selectedDate), "PPP"),

    // cell: ({ row }) => format(new Date(row.original.selectedDate), "PPP"),
    // cell: ({ row }) => {
    //   const role: string = row.getValue("role");

    //   return (
    //     <span
    //       className={` py-1.5 min-w-[75px] text-center inline-block rounded-full text-white text-sm font-medium ${getRoleBadgeStyle(
    //         role
    //       )}`}
    //     >
    //       {role}
    //     </span>
    //   );
    // },
  },
  {
    accessorKey: "selectedTIme",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      const time = new Date(row.original.selectedTime);
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  // {
  //   accessorKey: "isForSelf",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="For Self" />
  //   ),
  //   cell: ({ row }) => {
  //     const isForSelf = row.getValue("isForSelf");

  //     return (
  //       <span
  //         className={`px-4 py-1.5 rounded-full text-white text-sm font-medium ${
  //           isForSelf ? "bg-green-500/70" : "bg-yellow-400/60"
  //         }`}
  //       >
  //         {isForSelf ? "True" : "False"}
  //       </span>
  //     );
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => <AppointmentDataTableRowActions row={row} />,
  },
];

export const ServiceColumns: ColumnDef<User>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Service Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;

      return (
        <Tooltip title={description} placement="top" arrow>
          <div className="max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
            {description}
          </div>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "estimatedDuration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <ServiceDataTableRowActions row={row} />,
  },
];

export const NotificationColumns: ColumnDef<User>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Service Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;

      return (
        <Tooltip title={description} placement="top" arrow>
          <div className="max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
            {description}
          </div>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "estimatedDuration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <NotificationDataTableRowActions row={row} />,
  },
];

export const TicketsColumns: ColumnDef<Ticket>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "ticketDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("ticketDescription") as string;

      return (
        <Tooltip title={description} placement="top" arrow>
          <div className="max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
            {description}
          </div>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },

  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority");

      return (
        <span
          className={` py-1.5 min-w-[120px] text-center inline-block rounded-full text-black text-sm font-medium `}
        >
          {`${priority}`}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "userType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Type" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <TicketDataTableRowActions row={row} />,
  },
];

export const StaffColumns: ColumnDef<Ticket>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <StaffDataTableRowActions row={row} />,
  },
];
