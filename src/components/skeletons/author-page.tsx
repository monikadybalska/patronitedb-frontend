import { Skeleton } from "@mui/material";

export default function AuthorPageSkeleton() {
  return (
    <>
      <div className="content">
        <Skeleton
          variant="rectangular"
          height={378}
          sx={{ bgcolor: "#d13f40" }}
        />
        <h2>Number of patrons</h2>
        <Skeleton variant="rectangular" height={633} />
        <h2>Monthly revenue</h2>
        <Skeleton variant="rectangular" height={633} />
        <h2>Total revenue</h2>
        <Skeleton variant="rectangular" height={633} />
      </div>
    </>
  );
}
