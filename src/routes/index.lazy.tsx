import { createLazyFileRoute } from "@tanstack/react-router";
import BasicTable from "../components/tables/basic-table";
import HomepageHero from "../components/header";

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
            criteria="number_of_patrons"
          />
          <BasicTable title="Trending Authors" criteria="monthly_revenue" />
        </section>
        <section>
          <BasicTable
            title="Highest-Earning Authors"
            criteria="total_revenue"
          />
        </section>
      </div>
    </>
  );
}
