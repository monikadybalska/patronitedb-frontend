import { LineChart } from "@mui/x-charts/LineChart";

export default function AuthorChart({
  xAxis,
  series,
}: {
  xAxis: number[];
  series: (number | null)[];
}) {
  return (
    <LineChart
      xAxis={[
        {
          data: xAxis,
          valueFormatter: (value) => new Date(value).toLocaleDateString(),
        },
      ]}
      series={[
        {
          id: "authors",
          data: series,
          color: "#d13f40",
          connectNulls: true,
        },
      ]}
      height={500}
    ></LineChart>
  );
}
