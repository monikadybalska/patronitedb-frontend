import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Author } from "../../../lib/types";

export default function AuthorCriterionTable({
  data,
  criterion,
}: {
  data: Author[];
  criterion: "number_of_patrons" | "monthly_revenue" | "total_revenue";
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
        accessorKey: criterion,
        header: "Total",
        size: 150,
        Cell: ({ cell }) => cell.getValue<number>().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => {
          const prevIndex = data.findIndex((value) => value === row);
          if (prevIndex > -1 && prevIndex < data.length - 1) {
            return row[criterion] - data[prevIndex + 1][criterion];
          } else return "Unknown";
        },
        id: "gain",
        header: "Gain",
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
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
          const prevIndex = data.findIndex((value) => value === row);
          if (prevIndex > -1 && prevIndex < data.length - 1) {
            const currentValue = row[criterion];
            const previousValue = data[prevIndex + 1][criterion];
            if (currentValue === previousValue) {
              return 0;
            } else if (previousValue === 0) {
              return 100;
            } else
              return (
                ((currentValue - previousValue) / previousValue) *
                100
              ).toPrecision(2);
          } else return "Unknown";
        },
        id: "gain_percentage",
        header: "Gain %",
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          // @ts-expect-error: unrecognised getValue property types
          if (value === "Unknown") {
            return <span>{value}</span>;
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
  });

  return <MaterialReactTable table={table} />;
}
