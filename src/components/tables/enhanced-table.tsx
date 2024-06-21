import { Author } from "../../../lib/types";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useState, useMemo } from "react";

import {
  fetchAllCategories,
  fetchAllAuthorsData,
  fetchNumberofAuthors,
  fetchMinMax,
} from "../../../lib/api";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_ColumnFiltersState,
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
  const [sorting, setSorting] = useState<MRT_SortingState>(
    sortBy ? [{ id: sortBy, desc: true }] : []
  );
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  const { data: minMax } = useQuery({
    queryKey: ["minMax"],
    queryFn: fetchMinMax,
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
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["number_of_patrons"] : 0,
        },
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => row.monthly_revenue,
        id: "monthly_revenue",
        header: "Monthly revenue",
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["monthly_revenue"] : 0,
        },
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => row.total_revenue,
        id: "total_revenue",
        header: "Total revenue",
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["total_revenue"] : 0,
        },
        Cell: ({ cell }) => cell.getValue().toLocaleString("en-US"),
      },
      {
        accessorFn: (row) => (row.tags ? row.tags.split(",") : []),
        id: "tags",
        header: "Tags",
        filterVariant: "multi-select",
        filterFn: "arrIncludesSome",
        filterSelectOptions: categories,
        Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
      },
    ],
    [categories, minMax]
  );

  const { data: totalRowCount } = useQuery({
    queryKey: ["allAuthors", columnFilters],
    queryFn: () => fetchNumberofAuthors({ columnFilters }),
  });

  const rowCount = useMemo(() => totalRowCount, [totalRowCount]);

  const {
    data: serverData,
    fetchNextPage,
    fetchPreviousPage,
    status,
    isFetching,
  } = useInfiniteQuery<Author[]>({
    queryKey: [
      "authorsData",
      pagination.pageSize,
      sorting,
      columnFilters,
      rowCount,
    ],
    queryFn: async ({ pageParam }) => {
      const data = await fetchAllAuthorsData({
        sorting,
        pageParam: pageParam as number,
        pageSize: pagination.pageSize,
        totalRowCount: rowCount ? rowCount : 0,
        columnFilters: columnFilters,
      });

      return data;
    },
    enabled: !!totalRowCount && !!categories,
    initialPageParam: 0,
    // @ts-expect-error: unused props
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
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

  console.log("rerender");
  const flatData = useMemo(
    () =>
      serverData?.pages
        .flatMap((page) => page)
        .slice(
          pagination.pageIndex * pagination.pageSize,
          pagination.pageIndex * pagination.pageSize + pagination.pageSize
        ) || [],
    [serverData, pagination]
  );

  const table = useMaterialReactTable({
    columns,
    data: flatData,
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
    muiToolbarAlertBannerProps:
      status === "error"
        ? {
            color: "error",
            children: "Error loading data",
          }
        : undefined,
    renderBottomToolbar: () => (
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        pageParams={serverData?.pageParams as number[] | null}
        rowCount={rowCount || 0}
      />
    ),
    state: {
      pagination,
      sorting,
      columnFilters,
      showProgressBars: isFetching,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    autoResetPageIndex: false,
    rowCount,
  });

  return status === "success" && <MaterialReactTable table={table} />;
}
