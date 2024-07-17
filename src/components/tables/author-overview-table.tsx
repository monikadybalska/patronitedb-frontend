import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Author } from "../../../lib/types";
import { TableBody } from "@mui/material";

export default function AuthorOverviewTable({ author }: { author: Author[] }) {
  return (
    <TableContainer
      sx={{ width: "100%", maxWidth: 650, height: "fit-content" }}
      component={Paper}
    >
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell variant="head">Profile</TableCell>
            <TableCell>
              <a href={author[0].url}>{author[0].url}</a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Patrons</TableCell>
            <TableCell>
              {author[0].number_of_patrons === -1
                ? "Unknown"
                : author[0].number_of_patrons.toLocaleString("en-US")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Monthly revenue</TableCell>
            <TableCell>
              {author[0].monthly_revenue === -1
                ? "Unknown"
                : author[0].monthly_revenue.toLocaleString("en-US")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Categories</TableCell>
            <TableCell>{author[0].tags.split(",").join(", ")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Last record update</TableCell>
            <TableCell>{`${new Date(author[0].time).toUTCString()}`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
