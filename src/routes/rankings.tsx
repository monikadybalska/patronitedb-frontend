import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import EnhancedTable from "../components/tables/enhanced-table";

type ChartsSearch = {
  sortBy: string | undefined;
};

const Chart = function () {
  const { sortBy } = Route.useSearch();
  return (
    <>
      <Header
        title="Rankings"
        subtitle="Top authors by number of patrons and revenue"
      />
      <div className="content">
        <EnhancedTable sortBy={sortBy} />
      </div>
    </>
  );
};

export const Route = createFileRoute("/rankings")({
  validateSearch: (search: Record<string, unknown>): ChartsSearch => {
    return {
      sortBy: (search.sortBy as string) || undefined,
    };
  },
  component: Chart,
});
