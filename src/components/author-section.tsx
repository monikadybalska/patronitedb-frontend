import { Author, AuthorCriteria } from "../../lib/types";
import AuthorChart from "./charts/author-chart";
import { useMemo, useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import AuthorCriterionTable from "./tables/author-criterion-table";

export default function AuthorSection({
  title,
  data,
  criterion,
}: {
  title: string;
  data: Author[];
  criterion: keyof Pick<
    Author,
    "number_of_patrons" | "monthly_revenue" | "total_revenue"
  >;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const renderedData = useMemo(() => {
    if (columnFilters.length === 0) {
      return data;
    } else {
      let newData = data.slice();
      columnFilters.forEach((filter) => {
        newData = newData.filter((snapshot) => {
          const filterId = filter.id as keyof AuthorCriteria;
          const filterValue = filter.value as [number, number];
          const currentValue = snapshot[filterId];
          return (
            currentValue &&
            currentValue >= filterValue[0] &&
            currentValue <= filterValue[1]
          );
        });
      });
      return newData;
    }
  }, [data, columnFilters]);

  return (
    <section className="rows">
      <h2>{title}</h2>
      <div className="cols">
        <div className="col">
          <AuthorChart
            xAxis={renderedData.map((snapshot) => snapshot.time).reverse()}
            series={renderedData
              .map((snapshot) =>
                snapshot[criterion] === -1 ? null : snapshot[criterion]
              )
              .reverse()}
          />
        </div>
        <div className="col">
          <AuthorCriterionTable
            data={data}
            criterion={criterion}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </div>
      </div>
    </section>
  );
}
