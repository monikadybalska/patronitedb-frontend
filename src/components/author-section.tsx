import { Author } from "../../lib/types";
import AuthorChart from "./charts/author-chart";
import AuthorCriterionTable from "./tables/author-criterion-table";
import { useMemo } from "react";

export default function AuthorSection({
  title,
  data,
  criterion,
}: {
  title: string;
  data: Author[];
  criterion: "number_of_patrons" | "monthly_revenue" | "total_revenue";
}) {
  const renderedData = useMemo(() => data, [data]);
  return (
    <section className="rows">
      <h2>{title}</h2>
      <div className="cols">
        <div className="col">
          <AuthorChart
            xAxis={renderedData.map((snapshot) => snapshot.time).reverse()}
            series={renderedData
              .map((snapshot) => snapshot[criterion])
              .reverse()}
          />
        </div>
        <div className="col">
          <AuthorCriterionTable data={data} criterion={criterion} />
        </div>
      </div>
    </section>
  );
}
