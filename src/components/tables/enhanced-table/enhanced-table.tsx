import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EnhancedTableHead from "./enhanced-table-head";
import EnhancedTableToolbar from "./enhanced-table-toolbar";
import { useQuery } from "@tanstack/react-query";
import { Author, Order } from "../../../../lib/types";
import { getComparator, stableSort } from "../../../../lib/utils";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Filters from "./filters";

export default function EnhancedTable({ title }: { title: string }) {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Author>("total_revenue");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterListOpen, setFilterListOpen] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["chart"],
    queryFn: async (): Promise<Author[]> => {
      const response = await fetch(
        `https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors?criteria=total_revenue&offset=0&limit=100`
      );
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    },
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Author
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(event);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    console.log(event);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = data?.slice() || [];

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    if (data) {
      return stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return stableSort([], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [data, order, orderBy, page, rowsPerPage]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          boxShadow: "none",
          border: "1px solid #D9D9D9",
          boxSizing: "border-box",
        }}
      >
        <EnhancedTableToolbar
          title={title}
          filterListOpen={filterListOpen}
          setFilterListOpen={setFilterListOpen}
        />
        <Filters filterListOpen={filterListOpen} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{
                      cursor: "pointer",
                      ":hover": { backgroundColor: "#e5e5e5" },
                      position: "relative",
                    }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: 0,
                      }}
                    >
                      <Link
                        to={`/authors/${row.name}`}
                        className="row-link"
                      ></Link>
                      <img src={row.image_url} className="row-image"></img>
                      <p className="title-cell">{row.name}</p>
                    </TableCell>
                    <TableCell align="right">{row.number_of_patrons}</TableCell>
                    <TableCell align="right">{row.monthly_revenue}</TableCell>
                    <TableCell align="right">{row.total_revenue}</TableCell>
                    <TableCell align="right">
                      {row.tags.split(",").join(", ")}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
