"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { TableContainer, Paper } from "@mui/material";

import { DataTablePagination } from "../data-table-pagination";
import { CustomerDataTableToolbar } from "../data-table-toolbar/customerdata-table-toolbar";
import { RootState, useAppDispatch, useAppSelector } from "@/state/store";
import {
  retriveAppointment,
  retriveService,
  retriveUsers,
} from "@/state/admin/AdminServices";
import { useEffect } from "react";
import { AppointmentDataTableToolbar } from "../data-table-toolbar/appointmentdata-table-toolbar";

interface DataTableProps<TValue> {
  columns: ColumnDef<TValue>[];
}

export function AppointmentDataTable<TValue>({
  columns,
}: DataTableProps<TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { isSuccess: addSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.add.response
  );
  const { isSuccess: editSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.edit.response
  );
  const { isSuccess: deleteSuccess } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.delete.response
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(retriveAppointment());
    dispatch(retriveService());
  }, [dispatch, addSuccess, editSuccess, deleteSuccess]);

  const { details } = useAppSelector(
    (state: RootState) => state.admin.admin.appointment.view.response
  );

  const data = details;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 lg:max-w-[calc(100vw-120px)]">
      <AppointmentDataTableToolbar table={table} />

      <div className="overflow-y-auto max-w-screen overflow-x-auto  max-h-[300px] sm:max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-601px)] rounded-md border scrollbar ">
        <Table className="min-w-full text-[11px] sm:text-[13px] lg:text-[14px]">
          <TableHeader className=" z-20 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-2 py-1 md:py-2  text-start text-[12px] sm:text-[14px] lg:text-[16px] bg-slate-200"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className=" ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-2 py-2 text-start" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-start">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
