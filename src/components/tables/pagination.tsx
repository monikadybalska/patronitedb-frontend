import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { PaginationState } from "@tanstack/react-table";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { Author } from "../../../lib/types";

export default function Pagination({
  pagination,
  setPagination,
  fetchNextPage,
  fetchPreviousPage,
  pageParams,
  rowCount,
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
  pageParams: number[] | null;
  rowCount: number;
}) {
  const handleChangePage = (
    // @ts-expect-error: unused prop
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (newPage < pagination.pageIndex) {
      console.log(pagination.pageIndex);
      fetchPreviousPage();
      console.log(pagination.pageIndex);
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
      page={pagination.pageIndex}
      onPageChange={handleChangePage}
      rowsPerPage={pagination.pageSize}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
