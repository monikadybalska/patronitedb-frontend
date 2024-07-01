import { LineChart } from "@mui/x-charts/LineChart";

export default function AuthorChart({
  xAxis,
  series,
}: {
  xAxis: number[];
  series: number[];
}) {
  return (
    <LineChart
      //   sx={{
      //     "& .MuiAreaElement-series-authors": {
      //       fill: "url('#myGradient')",
      //     },
      //   }}
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
          //   area: true,
          color: "#d13f40",
        },
      ]}
      height={500}
    >
      {/* <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="#d13f40" />
          <stop offset="95%" stopColor="#ffffff" />
        </linearGradient>
      </defs> */}
    </LineChart>
  );
}
