import { createLazyFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import EnhancedTable from "../components/tables/enhanced-table";

export const Route = createLazyFileRoute("/charts")({
  component: () => (
    <>
      <Header title="Charts" subtitle="Charts and top rankings" />
      <div className="content">
        <EnhancedTable />
      </div>
    </>
  ),
});
