import { Author } from "../../../lib/types";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useState, useMemo } from "react";

import { fetchAllAuthors, fetchAllCategories } from "../../../lib/api";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
  MRT_PaginationState,
  // MRT_SortingState,
  // MRT_ColumnFiltersState,
} from "material-react-table";

import { Link } from "@tanstack/react-router";
import Pagination from "./pagination";

export type AuthorsDataAPIResponse = {
  data: Array<Author>;

  meta: {
    totalRowCount: number;
  };
};

export default function EnhancedTable({ sortBy }: { sortBy?: string }) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // const [sorting, setSorting] = useState<MRT_SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
  //   []
  // );

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

  const {
    data: serverData,
    error,
    fetchNextPage,
    fetchPreviousPage,
    // hasNextPage,
    // isFetching,
    // isFetchingNextPage,
    status,
  } = useInfiniteQuery<AuthorsDataAPIResponse>({
    queryKey: [
      "authorsData",
      // pagination.pageIndex,
      pagination.pageSize,
      // sorting,
      // sorting[0],
    ],
    queryFn: async ({ pageParam }) => {
      const totalRowCount = await fetchAllAuthors();

      const url = new URL(
        "/prod/top_authors",
        "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com"
      );
      url.searchParams.set(
        "offset",
        `${(pageParam as number) * pagination.pageSize}`
      );
      url.searchParams.set("limit", `${pagination.pageSize}`);

      const response = await fetch(url.href);

      const json = {
        data: await response.json(),
        meta: {
          totalRowCount: totalRowCount.length,
        },
      } as AuthorsDataAPIResponse;

      return json;
    },
    initialPageParam: 0,
    // @ts-expect-error: unused props
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      return typeof lastPageParam === "number" ? lastPageParam + 1 : undefined;
    },
    // @ts-expect-error: unused props
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (typeof firstPageParam === "number") {
        if (firstPageParam <= 1) {
          return undefined;
        }
        return firstPageParam - 1;
      }
      return undefined;
    },
  });

  const flatData = useMemo(
    () =>
      serverData?.pages
        .flatMap((page) => page.data)
        .slice(
          pagination.pageIndex * pagination.pageSize,
          pagination.pageIndex * pagination.pageSize + pagination.pageSize
        ) ?? [],
    [serverData, pagination.pageIndex, pagination.pageSize]
  );

  const rowCount = useMemo(
    () => serverData?.pages?.[0]?.meta?.totalRowCount ?? 0,
    [serverData]
  );

  const table = useMaterialReactTable({
    columns,
    data: flatData,
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
    state: {
      pagination,
      // sorting,
      // columnFilters,
    },
    // manualFiltering: true,
    manualPagination: true,
    // manualSorting: true,
    onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    rowCount,
    renderBottomToolbar: () => (
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        rowCount={rowCount}
      />
    ),
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <MaterialReactTable table={table} />
  );
}
