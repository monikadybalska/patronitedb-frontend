import { MRT_ColumnDef } from "material-react-table";
import { Author, RankingsTableValue } from "../../../../lib/types";
import { Link } from "@tanstack/react-router";

export default function RankingsTableColumns({
  categories,
  minMax,
}: {
  categories: string[] | undefined;
  minMax: Record<string, number> | undefined;
}) {
  const columns: MRT_ColumnDef<Author, RankingsTableValue>[] = [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: "Author",
      filterVariant: "text",
      Cell: ({ renderedCellValue, row }) => (
        <>
          <Link
            to={`/authors/${row.original.url.split("/").slice(-1)[0]}`}
            className="row-link"
          ></Link>
          <img src={row.original.image_url} className="row-image" />
          <span className="title-cell">{renderedCellValue}</span>
        </>
      ),
    },
    {
      accessorFn: (row) =>
        row.number_of_patrons === -1 ? null : row.number_of_patrons,
      id: "number_of_patrons",
      header: "Total patrons",
      filterVariant: "range-slider",
      muiFilterSliderProps: {
        min: 0,
        max: minMax ? minMax["number_of_patrons"] : 0,
        marks: [
          { value: 0 },
          { value: 1000 },
          { value: 5000 },
          { value: 10000 },
          { value: 20000 },
          { value: minMax ? minMax["number_of_patrons"] : 0 },
        ],
        step: null,
      },
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value === null ? "Unknown" : value.toLocaleString("en-US");
      },
    },
    {
      accessorFn: (row) =>
        row.monthly_revenue === -1 ? null : row.monthly_revenue,
      id: "monthly_revenue",
      header: "Monthly revenue",
      filterVariant: "range-slider",
      muiFilterSliderProps: {
        min: 0,
        max: minMax ? minMax["monthly_revenue"] : 0,
        marks: [
          { value: 0 },
          { value: 50000 },
          { value: 100000 },
          { value: 200000 },
          { value: 300000 },
          { value: 400000 },
          { value: 500000 },
          { value: 600000 },
          { value: minMax ? minMax["monthly_revenue"] : 0 },
        ],
        step: null,
      },
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value === null ? "Unknown" : value.toLocaleString("en-US");
      },
    },
    {
      accessorFn: (row) =>
        row.total_revenue === -1 ? null : row.total_revenue,
      id: "total_revenue",
      header: "Total revenue",
      filterVariant: "range-slider",
      muiFilterSliderProps: {
        min: 0,
        max: minMax ? minMax["total_revenue"] : 0,
        marks: [
          { value: 0 },
          { value: 100000 },
          { value: 500000 },
          { value: 1000000 },
          { value: 2000000 },
          { value: 3000000 },
          { value: 4000000 },
          { value: minMax ? minMax["total_revenue"] : 0 },
        ],
        step: null,
      },
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value === null ? "Unknown" : value.toLocaleString("en-US");
      },
    },
    {
      accessorFn: (row) => (row.tags ? row.tags.split(",") : []),
      id: "tags",
      header: "Tags",
      filterVariant: "multi-select",
      filterFn: "arrIncludesSome",
      filterSelectOptions: categories,
      Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
    },
  ];

  return columns;
}
