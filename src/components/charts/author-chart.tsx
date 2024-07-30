import { LineChart } from "@mui/x-charts/LineChart";
import { Author, AuthorCriteria } from "../../../lib/types.ts";
import { useMemo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Dayjs } from "dayjs";
import dayjs from "../../../dayjsconfig.ts";

export default function AuthorChart({
  data,
  criterion,
  columnFilters,
}: {
  data: Author[];
  criterion: "number_of_patrons" | "monthly_revenue";
  columnFilters: ColumnFiltersState;
}) {
  const renderedData = useMemo(() => {
    if (columnFilters.length === 0) {
      return data;
    } else {
      let newData = data.slice();
      // console.log(dayjs(newData[0].time).startOf("date"));
      columnFilters.forEach((filter) => {
        newData = newData.filter((snapshot) => {
          const filterId = filter.id as keyof AuthorCriteria;
          if (filterId === "time") {
            const filterValue = filter.value as
              | [undefined, undefined]
              | [undefined, Dayjs]
              | [Dayjs, undefined]
              | [Dayjs, Dayjs];
            const currentValue = dayjs(snapshot[filterId]);
            if (!filterValue[0] && !filterValue[1]) {
              return currentValue;
            } else if (!filterValue[0]) {
              return (
                currentValue &&
                currentValue.isSameOrBefore(filterValue[1], "date")
              );
            } else if (!filterValue[1]) {
              return (
                currentValue &&
                currentValue.isSameOrAfter(filterValue[0], "date")
              );
            } else
              return (
                currentValue &&
                currentValue.isSameOrAfter(filterValue[0], "date") &&
                currentValue.isSameOrBefore(filterValue[1], "date")
              );
          } else {
            const filterValue = filter.value as [number, number];
            const currentValue = snapshot[filterId];
            return (
              currentValue &&
              currentValue >= filterValue[0] &&
              currentValue <= filterValue[1]
            );
          }
        });
      });
      return newData;
    }
  }, [data, columnFilters]);

  return (
    <LineChart
      xAxis={[
        {
          data: renderedData.map((snapshot) => snapshot.time).reverse(),
          valueFormatter: (value) => new Date(value).toLocaleDateString(),
        },
      ]}
      series={[
        {
          id: "authors",
          data: renderedData
            .map((snapshot) =>
              snapshot[criterion] === -1 ? null : snapshot[criterion]
            )
            .reverse(),
          color: "#d13f40",
          connectNulls: true,
        },
      ]}
      height={500}
    ></LineChart>
  );
}
