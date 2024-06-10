import { Column } from "@tanstack/react-table";
import { Author } from "../../../../lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../../../lib/api";
import DebouncedInput from "../../debounced-input";

export default function Filter({
  column,
}: {
  column: Column<Author, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  const {
    isPending,
    isError,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) =>
        column.setFilterValue((current: string[] | undefined) => {
          if (current) {
            return current.includes(e.target.value)
              ? current.toSpliced(current.indexOf(e.target.value), 1)
              : [...current, e.target.value];
          } else return [e.target.value];
        })
      }
      value={columnFilterValue?.toString().split(", ")}
      multiple
    >
      <option value="">All</option>
      {categories?.map((category) => (
        <option value={category} key={category}>
          {category}
        </option>
      ))}
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}
