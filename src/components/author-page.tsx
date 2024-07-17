import {
  fetchAuthorById,
  fetchPatronsGainById,
  fetchMonthlyRevenueGainById,
} from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import AuthorSection from "./author-section";
import AuthorOverviewTable from "./tables/author-overview-table";
import AuthorPageSkeleton from "./skeletons/author-page";

export default function AuthorPage({ id }: { id: string }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["author overview", id],
    queryFn: () => fetchAuthorById(`https://patronite.pl/${id}`),
  });

  if (isLoading) {
    return <AuthorPageSkeleton />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    data && (
      <>
        <div className="content">
          <section className="author-overview">
            <div className="col">
              <h1>{data[0].name}</h1>
              <AuthorOverviewTable author={data} />
            </div>
            <img src={data[0].image_url} className="author-page-image"></img>
          </section>
          <AuthorSection
            title="Number of patrons"
            id={id}
            query={fetchPatronsGainById}
            criterion="number_of_patrons"
          />
          <AuthorSection
            title="Monthly revenue"
            id={id}
            query={fetchMonthlyRevenueGainById}
            criterion="monthly_revenue"
          />
        </div>
      </>
    )
  );
}
