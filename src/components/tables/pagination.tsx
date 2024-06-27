import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { Author } from "../../../lib/types";
import { useEffect, memo } from "react";

const Pagination = memo(function Pagination({
  pagination,
  setPagination,
  fetchNextPage,
  fetchPreviousPage,
  isFetching,
  pageParams,
  rowCount,
  sorting,
  columnFilters,
}: {
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<Author[], unknown>, Error>
  >;
  fetchPreviousPage: (
    options?: FetchPreviousPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<Author[], unknown>, Error>
  >;
  isFetching: boolean;
  pageParams: number[] | null;
  rowCount: number;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}) {
  useEffect(() => {
    setPagination((current) => {
      return { ...current, pageIndex: 0 };
    });
  }, [sorting, columnFilters]); // eslint-disable-line

  const handleChangePage = (
    // @ts-expect-error: unused prop
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (newPage < pagination.pageIndex) {
      fetchPreviousPage();
      setPagination((current) => {
        return { ...current, pageIndex: current.pageIndex - 1 };
      });
    } else {
      if (
        pageParams &&
        pageParams.length > 0 &&
        newPage > pageParams[pageParams.length - 1]
      ) {
        fetchNextPage();
      }
      setPagination((current) => {
        return { ...current, pageIndex: current.pageIndex + 1 };
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagination({ pageIndex: 0, pageSize: parseInt(event.target.value, 10) });
  };

  return (
    <TablePagination
      component="div"
      count={rowCount}
      page={!rowCount || rowCount <= 0 ? 0 : pagination.pageIndex}
      onPageChange={handleChangePage}
      rowsPerPage={pagination.pageSize}
      onRowsPerPageChange={handleChangeRowsPerPage}
      disabled={isFetching}
    />
  );
});

export default Pagination;
