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
import BasicTableBodySkeleton from "../skeletons/basic-table-body";

export default function HomepageTable({
  title,
  columns,
  query,
  link,
}: {
  title: string;
  columns: { title: string; key: keyof Author }[];
  query: () => Promise<Author[] | null>;
  link?: string;
}) {
  const { isPending, isLoading, isError, data, error } = useQuery({
    queryKey: [`${query}`],
    queryFn: query,
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
            <TableCell sx={{ fontSize: "1.5rem", color: "text.secondary" }}>
              {link ? (
                <Link to={link} style={{ display: "flex" }}>
                  {title}
                  <East sx={{ pl: 1 }} />
                </Link>
              ) : (
                <>{title}</>
              )}
            </TableCell>
            {columns.map((column) => (
              <TableCell align="right" key={column.title}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isPending) && <BasicTableBodySkeleton />}
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
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
