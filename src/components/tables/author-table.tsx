import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Author } from "../../../lib/types";
import { ColumnFiltersState } from "@tanstack/react-table";
import AuthorTableColumns from "./columns/author-table-columns";

export default function AuthorTable({
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
  const columns = useMemo<MRT_ColumnDef<Author>[]>(() => AuthorTableColumns({data, criterion}), [data, criterion])
  
  const table = useMaterialReactTable({
    columns,
    data,
    enableFacetedValues: true,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  return <MaterialReactTable table={table} />;
}
