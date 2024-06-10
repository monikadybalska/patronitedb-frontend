import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Filter from "./filter";

import { Author } from "../../../../lib/types";

import { useQuery } from "@tanstack/react-query";

import { useState, useMemo } from "react";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export default function Table() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  console.log("rerender");

  const columns = useMemo<ColumnDef<Author, string | number | string[]>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Author</span>,
      },
      {
        accessorFn: (row) => row.number_of_patrons,
        id: "number_of_patrons",
        header: "Total patrons",
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorFn: (row) => row.monthly_revenue,
        id: "monthly_revenue",
        header: "Monthly revenue",
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorFn: (row) => row.total_revenue,
        id: "total_revenue",
        header: "Total revenue",
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorFn: (row) => row.tags.split(",").join(", "),
        id: "tags",
        header: "Tags",
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: "select",
        },
        filterFn: "arrIncludesSome",
      },
    ],
    []
  );

  const { data: serverData } = useQuery({
    queryKey: ["chart"],
    queryFn: async (): Promise<Author[]> => {
      const response = await fetch(
        `https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors?criteria=total_revenue&offset=0&limit=100`
      );
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    },
  });

  const data = useMemo(() => serverData ?? [], [serverData]);

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      {/* <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre> */}
    </div>
  );
}
