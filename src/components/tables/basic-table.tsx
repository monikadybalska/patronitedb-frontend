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

export default function BasicTable({
  title,
  criteria,
}: {
  title: string;
  criteria: string;
}) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [criteria],
    queryFn: async (): Promise<Author[]> => {
      const response = await fetch(
        `https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors?criteria=${criteria}&offset=0&limit=10`
      );
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    },
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

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
              <Link
                to="/charts"
                search={{
                  sortBy: criteria,
                }}
                style={{ display: "flex" }}
              >
                {title}
                <East sx={{ pl: 1 }} />
              </Link>
            </TableCell>
            <TableCell align="right">Patrons total</TableCell>
            <TableCell align="right">Monthly revenue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
                <Link to={`/authors/${row.name}`} className="row-link"></Link>
                <img src={row.image_url} className="row-image"></img>
                <p className="title-cell">{row.name}</p>
              </TableCell>
              <TableCell align="right">{row.number_of_patrons}</TableCell>
              <TableCell align="right">{row.monthly_revenue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
