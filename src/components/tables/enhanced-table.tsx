import { Author } from "../../../lib/types";

import { useQuery } from "@tanstack/react-query";

import { useMemo } from "react";

import { fetchAllCategories } from "../../../lib/api";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";

import { Link } from "@tanstack/react-router";

export default function EnhancedTable({ sortBy }: { sortBy?: string }) {
  console.log("rerender");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  const columns = useMemo<
    MRT_ColumnDef<
      Author,
      string | number | string[] | { name: string; image: string }
    >[]
  >(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: "Author",
        Cell: ({ renderedCellValue, row }) => (
          <>
            <Link
              to={`/authors/${renderedCellValue}`}
              className="row-link"
            ></Link>
            <img src={row.original.image_url} className="row-image" />
            <span className="title-cell">{renderedCellValue}</span>
          </>
        ),
        sx: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: 0,
        },
      },
      {
        accessorFn: (row) => row.number_of_patrons,
        id: "number_of_patrons",
        header: "Total patrons",
        filterVariant: "range-slider",
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => row.monthly_revenue,
        id: "monthly_revenue",
        header: "Monthly revenue",
        filterVariant: "range-slider",
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => row.total_revenue,
        id: "total_revenue",
        header: "Total revenue",
        filterVariant: "range-slider",
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => row.tags.split(","),
        id: "tags",
        header: "Tags",
        filterVariant: "multi-select",
        filterFn: "arrIncludesSome",
        filterSelectOptions: categories,
        Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
      },
    ],
    [categories]
  );

  const { data: serverData } = useQuery({
    queryKey: ["chart"],
    queryFn: async (): Promise<Author[]> => {
      const response = await fetch(
        `https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors?criteria=total_revenue&offset=0&limit=1000`
      );
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    },
  });

  const data = useMemo(() => serverData ?? [], [serverData]);

  const table = useMaterialReactTable({
    columns,
    data,
    enableFacetedValues: true,
    muiTableBodyCellProps: ({ column }) => {
      if (column.id === "name") {
        return {
          sx: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: 0,
            width: "100%",
          },
        };
      } else return { sx: {} };
    },
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
      </>
    ),
    initialState: {
      sorting: sortBy ? [{ id: sortBy, desc: true }] : [],
    },
  });

  return <MaterialReactTable table={table} />;
}
