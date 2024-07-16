import { Skeleton } from "@mui/material";

export default function AuthorSectionSkeleton({ title }: { title: string }) {
  return (
    <>
      <h2>{title}</h2>
      <Skeleton variant="rectangular" height={633} />
    </>
  );
}
