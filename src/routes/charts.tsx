import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import EnhancedTable from "../components/tables/enhanced-table";

type ChartsSearch = {
  sortBy: string;
};

const Chart = function () {
  const { sortBy } = Route.useSearch();
  return (
    <>
      <Header title="Charts" subtitle="Charts and top rankings" />
      <div className="content">
        <EnhancedTable sortBy={sortBy} />
      </div>
    </>
  );
};

export const Route = createFileRoute("/charts")({
  validateSearch: (search: Record<string, unknown>): ChartsSearch => {
    // validate and parse the search params into a typed state
    return {
      sortBy: (search.sortBy as string) || "",
    };
  },
  component: Chart,
});
