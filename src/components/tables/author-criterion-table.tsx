import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Author } from "../../../lib/types";
import { ColumnFiltersState } from "@tanstack/react-table";

export default function AuthorCriterionTable({
  data,
  criterion,
  columnFilters,
  setColumnFilters,
}: {
  data: Author[];
  criterion: keyof Pick<
    Author,
    "number_of_patrons" | "monthly_revenue" | "total_revenue"
  >;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}) {
  const columns = useMemo<MRT_ColumnDef<Author>[]>(
    () => [
      {
        accessorKey: "time",
        header: "Date",
        size: 150,
        Cell: ({ cell }) =>
          new Date(cell.getValue<Date>()).toLocaleDateString(),
      },
      {
        accessorFn: (row) => (row[criterion] === -1 ? null : row[criterion]),
        id: criterion,
        header: "Total",
        size: 150,
        filterVariant: "range-slider",
        Cell: ({ cell }) =>
          cell.getValue<number>() !== null
            ? cell.getValue<number>().toLocaleString("en-US")
            : "Unknown",
      },
      {
        accessorFn: (row) => {
          if (row[criterion] === -1) {
            return null;
          }
          return row[`${criterion}_gain`] ? row[`${criterion}_gain`] : 0;
        },
        id: `${criterion}_gain`,
        header: "Gain",
        size: 150,
        filterVariant: "range-slider",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          if (cell.row.index === data.length - 1 || value === null) {
            return "Unknown";
          } else
            return (
              <span
                style={{
                  color: value < 0 ? "red" : value > 0 ? "green" : "",
                }}
              >
                {value > 0
                  ? `+${value.toLocaleString("en-US")}`
                  : value.toLocaleString("en-US")}
              </span>
            );
        },
      },
      {
        accessorFn: (row) => {
          if (row[criterion] === -1) {
            return null;
          }
          const value = row[`${criterion}_gain_percentage`];
          return value ? parseFloat(value.toFixed(2)) : 0;
        },
        id: `${criterion}_gain_percentage`,
        header: "Gain %",
        size: 150,
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          step: 0.01,
        },
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          if (cell.row.index === data.length - 1 || value === null) {
            return "Unknown";
          } else {
            return (
              <span
                style={{
                  color: value < 0 ? "red" : value > 0 ? "green" : "",
                }}
              >
                {value > 0 ? `+${value}%` : `${value}%`}
              </span>
            );
          }
        },
      },
    ],
    [data, criterion]
  );
  const table = useMaterialReactTable({
    columns,
    data,
    enableFacetedValues: true,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  return <MaterialReactTable table={table} />;
}
