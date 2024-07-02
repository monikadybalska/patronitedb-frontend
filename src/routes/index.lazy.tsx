import { createLazyFileRoute } from "@tanstack/react-router";
import HomepageTable from "../components/tables/homepage-table";
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
        <HomepageTable
          title="Most Subscribed Authors"
          columns={[
            { title: "Patrons total", key: "number_of_patrons" },
            { title: "Total revenue", key: "total_revenue" },
          ]}
          query={fetchTopAuthors}
          link="/charts?sortBy=number_of_patrons"
        />
        <div className="cols">
          <div className="col">
            <HomepageTable
              title="Trending Authors"
              columns={[
                { title: "Patrons total", key: "number_of_patrons" },
                { title: "7-day gain", key: "gain" },
              ]}
              query={fetchTrendingAuthors}
            />
          </div>
          <div className="col">
            <HomepageTable
              title="Highest-Earning Authors"
              columns={[
                { title: "Patrons total", key: "number_of_patrons" },
                { title: "Total revenue", key: "total_revenue" },
              ]}
              query={fetchTopAuthors}
              link="/charts?sortBy=total_revenue"
            />
          </div>
        </div>
      </div>
    </>
  );
}
