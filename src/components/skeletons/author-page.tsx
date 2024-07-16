import { Skeleton } from "@mui/material";
import AuthorSectionSkeleton from "./author-section";

export default function AuthorPageSkeleton() {
  return (
    <>
      <div className="content">
        <Skeleton
          variant="rectangular"
          height={378}
          sx={{ bgcolor: "#d13f40" }}
        />
        <AuthorSectionSkeleton title="Number of patrons" />
        <AuthorSectionSkeleton title="Monthly revenue" />
      </div>
    </>
  );
}
