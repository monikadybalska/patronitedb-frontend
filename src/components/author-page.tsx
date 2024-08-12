import {
  fetchPatronsGainByUrl,
  fetchMonthlyRevenueGainByUrl,
} from "../../lib/api";
import { Author } from "../../lib/types";
import AuthorSection from "./author-section";
import AuthorOverviewTable from "./tables/author-overview-table";

export default function AuthorPage({
  id,
  data,
}: {
  id: string;
  data: Author[];
}) {
  return (
    <>
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
        query={fetchPatronsGainByUrl}
        criterion="number_of_patrons"
      />
      <AuthorSection
        title="Monthly revenue"
        id={id}
        query={fetchMonthlyRevenueGainByUrl}
        criterion="monthly_revenue"
      />
    </>
  );
}
