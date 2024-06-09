import { createLazyFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
// import EnhancedTable from "../components/tables/enhanced-table/enhanced-table";
import TanstackTable from "../components/tables/tanstack-table/table";

export const Route = createLazyFileRoute("/charts")({
  component: () => (
    <>
      <Header title="Charts" subtitle="Charts and top rankings" />
      <div className="content">
        {/* <EnhancedTable title="Highest-Earning Authors" /> */}
        <TanstackTable />
      </div>
    </>
  ),
});
