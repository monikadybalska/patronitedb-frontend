import { Author } from "../../../lib/types";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";

import { fetchAllAuthors, fetchAllCategories, fetchAllAuthorsData } from "../../../lib/api";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
  MRT_SortingState,
  MRT_ColumnFiltersState,
  MRT_RowVirtualizer,
} from "material-react-table";

import { Link } from "@tanstack/react-router";

export type AuthorsDataAPIResponse = {
  data: Array<Author>;

  meta: {
    totalRowCount: number;
  };
};

const fetchSize = 10

export default function InfiniteTable({ sortBy }: { sortBy?: string }) {
  console.log("rerender")
  const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method
  const [sorting, setSorting] = useState<MRT_SortingState>(sortBy ? [{ id: sortBy, desc: true }] : []);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

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
          accessorFn: (row) => row.tags ? row.tags.split(",") : [],
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
    fetchNextPage,
    isError, 
    isFetching, 
    isLoading
  } = useInfiniteQuery<AuthorsDataAPIResponse>({
    queryKey: [
      "authorsData",
      sorting,
      columnFilters,
      globalFilter
    ],
    queryFn: async ({ pageParam }) => {
      const totalRowCount = await fetchAllAuthors();
      return fetchAllAuthorsData({
        sorting, 
        pageParam: pageParam as number, 
        pageSize: fetchSize,
        totalRowCount: totalRowCount.length, 
        columnFilters: columnFilters})
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(
    () =>
      serverData?.pages
        .flatMap((page) => page.data) ?? [],
    [serverData]
  );

  const rowCount = useMemo(
    () => serverData?.pages?.[0]?.meta?.totalRowCount ?? 0,
    [serverData]
  );

  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < rowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, rowCount],
  );

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }

  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useMaterialReactTable({
    columns,
    data: flatData,
    enableFacetedValues: true,
    enablePagination: false,
    enableRowVirtualization: true,
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
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    renderBottomToolbarCustomActions: () => (
      <div>
        Fetched {totalFetched} of {rowCount} total rows.
      </div>

    ),
    rowCount,
    rowVirtualizerInstanceRef, //get access to the virtualizer instance
    rowVirtualizerOptions: { overscan: 4 },
  });

  return <MaterialReactTable table={table} />;
}
