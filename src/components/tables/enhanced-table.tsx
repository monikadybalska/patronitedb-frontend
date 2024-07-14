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
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  const { data: minMax, isLoading: isLoadingMinMax } = useQuery({
    queryKey: ["minMax"],
    queryFn: fetchMinMax,
  });

  const columns = useMemo<
    MRT_ColumnDef<
      Author,
      string | number | null | string[] | { name: string; image: string }
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
              to={`/authors/${row.original.url.split("/").slice(-1)[0]}`}
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
        accessorFn: (row) =>
          row.number_of_patrons === -1 ? null : row.number_of_patrons,
        id: "number_of_patrons",
        header: "Total patrons",
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["number_of_patrons"] : 0,
          marks: [
            { value: 0 },
            { value: 1000 },
            { value: 5000 },
            { value: 10000 },
            { value: 20000 },
            { value: minMax ? minMax["number_of_patrons"] : 0 },
          ],
          step: null,
        },
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value === null ? "Unknown" : value.toLocaleString("en-US");
        },
      },
      {
        accessorFn: (row) =>
          row.monthly_revenue === -1 ? null : row.monthly_revenue,
        id: "monthly_revenue",
        header: "Monthly revenue",
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["monthly_revenue"] : 0,
          marks: [
            { value: 0 },
            { value: 50000 },
            { value: 100000 },
            { value: 200000 },
            { value: 300000 },
            { value: 400000 },
            { value: 500000 },
            { value: 600000 },
            { value: minMax ? minMax["monthly_revenue"] : 0 },
          ],
          step: null,
        },
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value === null ? "Unknown" : value.toLocaleString("en-US");
        },
      },
      {
        accessorFn: (row) =>
          row.total_revenue === -1 ? null : row.total_revenue,
        id: "total_revenue",
        header: "Total revenue",
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 0,
          max: minMax ? minMax["total_revenue"] : 0,
          marks: [
            { value: 0 },
            { value: 100000 },
            { value: 500000 },
            { value: 1000000 },
            { value: 2000000 },
            { value: 3000000 },
            { value: 4000000 },
            { value: minMax ? minMax["total_revenue"] : 0 },
          ],
          step: null,
        },
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value === null ? "Unknown" : value.toLocaleString("en-US");
        },
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

  const { data: totalRowCount, isLoading: isLoadingRows } = useQuery({
    queryKey: ["allAuthors", columnFilters],
    queryFn: () => {
      return fetchNumberofAuthors({ columnFilters });
    },
  });

  const rowCount = useMemo(() => totalRowCount, [totalRowCount]);

  const {
    data: serverData,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isLoading,
    isError,
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
    initialPageParam: 0,
    enabled: !!categories && !!minMax && !!totalRowCount,
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
            height: "100px",
          },
        };
      } else return { sx: {} };
    },
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
      </>
    ),
    renderBottomToolbar: () => (
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        isFetching={isFetching}
        pageParams={serverData?.pageParams as number[] | null}
        rowCount={rowCount || 0}
        sorting={sorting}
        columnFilters={columnFilters}
      />
    ),
    initialState: {
      showColumnFilters: true,
    },
    state: {
      pagination,
      sorting,
      columnFilters,
      showProgressBars: isFetching,
      isLoading:
        isFetching ||
        isLoading ||
        isLoadingCategories ||
        isLoadingMinMax ||
        isLoadingRows,
      showAlertBanner: isError,
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

  return <MaterialReactTable table={table} />;
}
