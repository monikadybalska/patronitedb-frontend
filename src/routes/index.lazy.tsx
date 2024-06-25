import { createLazyFileRoute } from "@tanstack/react-router";
import BasicTable from "../components/tables/basic-table";
import HomepageHero from "../components/header";
import { fetchTopAuthors, fetchTrendingAuthors } from "../../lib/api";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <HomepageHero
        title="PatroniteDB"
        subtitle="This third-party website gives you better insight into Patronite and
        everything in its database."
      />
      <div className="content">
        <section>
          <BasicTable
            title="Most Subscribed Authors"
            columns={[
              { title: "Patrons total", key: "number_of_patrons" },
              { title: "Total revenue", key: "total_revenue" },
            ]}
            query={fetchTopAuthors}
            link="/charts?sortBy=number_of_patrons"
          />
          <BasicTable
            title="Trending Authors"
            columns={[
              { title: "Patrons total", key: "number_of_patrons" },
              { title: "Patrons last 7 days", key: "increase" },
            ]}
            query={fetchTrendingAuthors}
          />
        </section>
        <section>
          <BasicTable
            title="Highest-Earning Authors"
            columns={[
              { title: "Patrons total", key: "number_of_patrons" },
              { title: "Total revenue", key: "total_revenue" },
            ]}
            query={fetchTopAuthors}
            link="/charts?sortBy=total_revenue"
          />
        </section>
      </div>
    </>
  );
}
