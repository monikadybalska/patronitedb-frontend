import { Author } from "../../lib/types";
import AuthorChart from "./charts/author-chart";
import { useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import AuthorTable from "./tables/author-table";
import { useQuery } from "@tanstack/react-query";
import AuthorSectionSkeleton from "./skeletons/author-section";

export default function AuthorSection({
  title,
  id,
  query,
  criterion,
}: {
  title: string;
  id: string;
  query: (id: string) => Promise<Author[]>;
  criterion: "number_of_patrons" | "monthly_revenue";
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["author section", criterion, id],
    queryFn: () => query(`https://patronite.pl/${id}`),
  });

  if (isLoading) {
    return <AuthorSectionSkeleton title={title} />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    data && (
      <section className="rows">
        <h2>{title}</h2>
        <div className="cols">
          <div className="col">
            <AuthorChart
              data={data}
              criterion={criterion}
              columnFilters={columnFilters}
            />
          </div>
          <div className="col">
            <AuthorTable
              data={data}
              criterion={criterion}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          </div>
        </div>
      </section>
    )
  );
}
