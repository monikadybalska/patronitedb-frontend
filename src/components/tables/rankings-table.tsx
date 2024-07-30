import { Author, RankingsTableValue } from "../../../lib/types";

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

import Pagination from "./pagination";
import RankingsTableColumns from "./columns/rankings-table-columns";

export default function RankingsTable({ sortBy }: { sortBy?: string }) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: sortBy || "number_of_patrons", desc: true },
  ]);
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
  const { data: totalRowCount, isLoading: isLoadingRows } = useQuery({
    queryKey: ["allAuthors", columnFilters],
    queryFn: () => {
      return fetchNumberofAuthors({ columnFilters });
    },
  });
  const {
    data: serverData,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isLoading,
    isError,
  } = useInfiniteQuery<Author[]>({
    queryKey: ["authorsData", pagination.pageSize, sorting, columnFilters],
    queryFn: async ({ pageParam }) => {
      const data = await fetchAllAuthorsData({
        sorting,
        pageParam: pageParam as number,
        pageSize: pagination.pageSize,
        columnFilters,
      });

      return data;
    },
    initialPageParam: 0,
    // enabled: !!categories && !!minMax && !!totalRowCount,
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

  const columns = useMemo<MRT_ColumnDef<Author, RankingsTableValue>[]>(
    () => RankingsTableColumns({ categories, minMax }),
    [categories, minMax]
  );
  const rowCount = useMemo(() => totalRowCount, [totalRowCount]);
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
