import { createLazyFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Table from "../components/tables/tanstack-table/table";

export const Route = createLazyFileRoute("/charts")({
  component: () => (
    <>
      <Header title="Charts" subtitle="Charts and top rankings" />
      <div className="content">
        <Table />
      </div>
    </>
  ),
});
