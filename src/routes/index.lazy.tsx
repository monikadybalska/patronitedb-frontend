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
          title="Top Authors"
          columns={[
            { title: "Patrons total", key: "number_of_patrons" },
            { title: "Monthly revenue", key: "monthly_revenue" },
          ]}
          query={() => fetchTopAuthors({ criteria: "number_of_patrons" })}
          link="/charts?sortBy=number_of_patrons"
        />
        <HomepageTable
          title="Trending Authors"
          columns={[
            { title: "Patrons total", key: "number_of_patrons" },
            { title: "7-day gain", key: "gain" },
          ]}
          query={fetchTrendingAuthors}
        />
      </div>
    </>
  );
}
