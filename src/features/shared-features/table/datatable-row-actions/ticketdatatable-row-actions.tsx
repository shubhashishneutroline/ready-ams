"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useAppDispatch } from "@/state/store";
import {
  setEditCustomerFormTrue,
  setEditCustomerId,
  setEditStaffId,
  setEditStaffResourceTrue,
  setEditTicketId,
  setEditTicketTrue,
} from "@/state/admin/AdminSlice";
import {
  deleteStaff,
  deleteTicket,
  deleteUser,
} from "@/state/admin/AdminServices";

interface CustomerDataTableRowActionsProps<TData> {
  row: Row<TData> | any;
}

export function TicketDataTableRowActions<TData>({
  row,
}: CustomerDataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original);

  const dispatch = useAppDispatch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            dispatch(setEditTicketId(row.original.id));
            dispatch(setEditTicketTrue(true));
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(deleteTicket(row.original));
          }}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
