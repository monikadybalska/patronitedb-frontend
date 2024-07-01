import { fetchAuthorById } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import AuthorSection from "./author-section";
import AuthorTable from "./tables/author-table";

export default function AuthorPage({ id }: { id: string }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [id],
    queryFn: () => fetchAuthorById(`https://patronite.pl/${id}`),
  });

  if (isLoading) {
    return <span>Loading...</span>;
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
              <AuthorTable author={data} />
            </div>
            <img src={data[0].image_url} className="author-page-image"></img>
          </section>
          <AuthorSection
            title="Number of patrons"
            data={data}
            criterion="number_of_patrons"
          />
          <AuthorSection
            title="Monthly revenue"
            data={data}
            criterion="monthly_revenue"
          />
          <AuthorSection
            title="Total revenue"
            data={data}
            criterion="total_revenue"
          />
        </div>
      </>
    )
  );
}
