import { createLazyFileRoute } from "@tanstack/react-router";
import HomepageTable from "../components/tables/homepage-table";
import HomepageHero from "../components/header";
import { fetchTopAuthors } from "../../lib/api";
import TrendingAuthorsTable from "../components/tables/trending-authors-table";

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
      <HomepageTable
        title="Top Authors"
        columns={[
          { title: "Patrons total", key: "number_of_patrons" },
          { title: "Monthly revenue", key: "monthly_revenue" },
        ]}
        query={() => fetchTopAuthors({ criteria: "number_of_patrons" })}
        link="/rankings?sortBy=number_of_patrons"
      />
      <TrendingAuthorsTable title="Trending Authors" />
    </>
  );
}
