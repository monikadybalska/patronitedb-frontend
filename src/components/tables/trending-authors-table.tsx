import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { Author } from "../../../lib/types";
import { Link } from "@tanstack/react-router";
import TableBodySkeleton from "../skeletons/table-body";
import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { fetchTrendingAuthors } from "../../../lib/api";
import SelectTable from "./select-table";

export default function TrendingAuthorsTable({ title }: { title: string }) {
  const [columns, setColumns] = useState<{
    sort: "desc" | "asc";
    criterion: keyof Author;
    gain: string;
  }>({
    sort: "desc",
    criterion: "number_of_patrons",
    gain: "7",
  });

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setColumns((current) => {
      return {
        ...current,
        [event.target.name]: event.target.value,
      };
    });
  };

  const { isPending, isLoading, isError, data, error } = useQuery({
    queryKey: ["trending authors", columns],
    queryFn: () =>
      fetchTrendingAuthors({
        criterion: columns.criterion,
        days: parseInt(columns.gain),
        sort: columns.sort,
      }),
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid #D9D9D9",
        boxSizing: "border-box",
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ height: "fit-content", width: "100%" }}>
            <TableCell
              sx={{
                fontSize: "1.5rem",
                color: "text.secondary",
              }}
            >
              <div className="row-with-options">
                {title}
                <SelectTable
                  value={columns.sort}
                  name="sort"
                  options={[
                    { value: "desc", title: "Upwards" },
                    { value: "asc", title: "Downwards" },
                  ]}
                  handleChange={handleChange}
                />
              </div>
            </TableCell>
            <TableCell
              align="right"
              key={columns.criterion}
              sx={{ width: "131px" }}
            >
              <SelectTable
                value={columns.criterion}
                name="criterion"
                options={[
                  { value: "number_of_patrons", title: "Total patrons" },
                  { value: "monthly_revenue", title: "Monthly revenue" },
                ]}
                handleChange={handleChange}
              />
            </TableCell>
            <TableCell align="right" key="gain" sx={{ width: "131px" }}>
              <SelectTable
                value={columns.gain}
                name="gain"
                options={[
                  { value: "7", title: "Last 7 days" },
                  { value: "14", title: "Last 14 days" },
                ]}
                handleChange={handleChange}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isPending) && <TableBodySkeleton />}
          {data && data.length > 0 ? (
            data.map((row) => (
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  ":hover": { backgroundColor: "#e5e5e5" },
                  position: "relative",
                }}
                key={row.name}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: 0,
                  }}
                >
                  <Link
                    to={`/authors/${row.url.split("/").slice(-1)[0]}`}
                    className="row-link"
                  ></Link>
                  <img src={row.image_url} className="row-image"></img>
                  <p className="title-cell">{row.name}</p>
                </TableCell>
                <TableCell align="right">
                  {!row[columns.criterion] || row[columns.criterion] === -1
                    ? "Unknown"
                    : row[columns.criterion]?.toLocaleString("en-us")}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: columns.sort === "desc" ? "green" : "red" }}
                >
                  {columns.sort === "desc" && "+"}
                  {!row.gain ? "Unknown" : row.gain?.toLocaleString("en-us")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                No data for the selected period. Select a different period or
                try again later.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
