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
import { East } from "@mui/icons-material";
import TableBodySkeleton from "../skeletons/table-body";
import SelectCriterion from "./select-criterion";
import { SelectChangeEvent } from "@mui/material";
import { useMemo, useState } from "react";
import { fetchTrendingAuthors } from "../../../lib/api";

export default function TrendingAuthorsTable({
  title,
  link,
}: {
  title: string;
  link?: string;
}) {
  const [criterion, setCriterion] = useState<
    "number_of_patrons" | "monthly_revenue"
  >("number_of_patrons");

  const columns = useMemo(
    (): { title: string; key: keyof Author }[] => [
      {
        title:
          criterion === "number_of_patrons"
            ? "Patrons total"
            : "Monthly revenue",
        key: criterion,
      },
      { title: "7-day gain", key: "gain" },
    ],
    [criterion]
  );

  const handleChange = (event: SelectChangeEvent) => {
    setCriterion(event.target.value as "number_of_patrons" | "monthly_revenue");
  };

  const { isPending, isLoading, isError, data, error } = useQuery({
    queryKey: ["trending authors", criterion],
    queryFn: () => fetchTrendingAuthors({ criterion }),
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
          <TableRow>
            <TableCell
              sx={{
                fontSize: "1.5rem",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {link ? (
                <Link to={link} style={{ display: "flex" }}>
                  {title}
                  <East sx={{ pl: 1 }} />
                </Link>
              ) : (
                <>{title}</>
              )}
              <SelectCriterion
                criterion={criterion}
                handleChange={handleChange}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell align="right" key={column.title}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isPending) && <TableBodySkeleton />}
          {data?.map((row) => (
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
              {columns.map((column, i) => (
                <TableCell align="right" key={i}>
                  {!row[column.key] || row[column.key] === -1
                    ? "Unknown"
                    : row[column.key]?.toLocaleString("en-us")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
