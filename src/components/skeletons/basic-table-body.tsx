import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";

export default function BasicTableBodySkeleton() {
  return new Array(10)
    .fill({
      image: <Skeleton variant="rectangular" height={100} width={100} />,
      text: (
        <Skeleton variant="text" sx={{ display: "flex", minWidth: "50%" }} />
      ),
    })
    .map((row, i) => (
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          ":hover": { backgroundColor: "#e5e5e5" },
          position: "relative",
        }}
        key={i}
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
          {row.image}
          {row.text}
        </TableCell>
        <TableCell align="right">{row.text}</TableCell>
        <TableCell align="right">{row.text}</TableCell>
      </TableRow>
    ));
}
