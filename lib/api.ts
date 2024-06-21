import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

interface Author {
  image_url: string;
  is_recommended: "true" | "false";
  monthly_revenue: number;
  name: string;
  number_of_patrons: number;
  tags: string;
  time: number;
  total_revenue: number;
  url: string;
}

export async function fetchMostSubscribedAuthors(): Promise<Author[] | null> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors?criteria=number_of_patrons&offset=0&limit=10"
  );
  return response.json();
}

// export async function fetchAllAuthorsData(): Promise<Author[]> {
//   const response = await fetch(
//     "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors"
//   );
//   return response.json();
// }

export async function fetchAllAuthorsData({
  sorting,
  pageParam,
  pageSize,
  columnFilters,
}: {
  sorting: SortingState;
  pageParam: number;
  pageSize: number;
  totalRowCount: number;
  columnFilters: ColumnFiltersState;
}): Promise<Author[]> {
  console.log(pageParam);
  const filters: Record<string, number[]> = columnFilters.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.id]: currentValue.value }),
    {}
  );
  const url = new URL("/dev/top_authors", "http://127.0.0.1:8000");
  sorting.length > 0 && url.searchParams.set("criteria", `${sorting[0].id}`);
  sorting.length > 0 &&
    url.searchParams.set("order", sorting[0].desc ? "desc" : "asc");
  url.searchParams.set("offset", `${pageParam * pageSize}`);
  url.searchParams.set("limit", `${pageSize}`);
  filters["tags"] &&
    url.searchParams.set("tags", `${filters["tags"].join(",")}`);
  filters["total_revenue"] &&
    url.searchParams.set("min_total_revenue", `${filters["total_revenue"][0]}`);
  filters["total_revenue"] &&
    url.searchParams.set("max_total_revenue", `${filters["total_revenue"][1]}`);
  filters["monthly_revenue"] &&
    url.searchParams.set(
      "min_monthly_revenue",
      `${filters["monthly_revenue"][0]}`
    );
  filters["monthly_revenue"] &&
    url.searchParams.set(
      "max_monthly_revenue",
      `${filters["monthly_revenue"][1]}`
    );
  filters["number_of_patrons"] &&
    url.searchParams.set(
      "min_number_of_patrons",
      `${filters["number_of_patrons"][0]}`
    );
  filters["number_of_patrons"] &&
    url.searchParams.set(
      "max_number_of_patrons",
      `${filters["number_of_patrons"][1]}`
    );

  console.log(url.href);

  const response = await fetch(url.href);

  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchAllAuthors(): Promise<
  Pick<Author, "name" | "url">[]
> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/metadata/authors"
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchNumberofAuthors({
  columnFilters,
}: {
  columnFilters: ColumnFiltersState;
}): Promise<number> {
  const filters: Record<string, number[]> = columnFilters.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.id]: currentValue.value }),
    {}
  );
  const url = new URL("/dev/metadata/row_count", "http://127.0.0.1:8000");
  // const response = await fetch(
  //   "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/metadata/authors"
  // );
  filters["tags"] &&
    url.searchParams.set("tags", `${filters["tags"].join(",")}`);
  filters["total_revenue"] &&
    url.searchParams.set("min_total_revenue", `${filters["total_revenue"][0]}`);
  filters["total_revenue"] &&
    url.searchParams.set("max_total_revenue", `${filters["total_revenue"][1]}`);
  filters["monthly_revenue"] &&
    url.searchParams.set(
      "min_monthly_revenue",
      `${filters["monthly_revenue"][0]}`
    );
  filters["monthly_revenue"] &&
    url.searchParams.set(
      "max_monthly_revenue",
      `${filters["monthly_revenue"][1]}`
    );
  filters["number_of_patrons"] &&
    url.searchParams.set(
      "min_number_of_patrons",
      `${filters["number_of_patrons"][0]}`
    );
  filters["number_of_patrons"] &&
    url.searchParams.set(
      "max_number_of_patrons",
      `${filters["number_of_patrons"][1]}`
    );

  const response = await fetch(url.href);

  if (!response.ok) {
    throw new Error("Network response error");
  }
  const json: number = await response.json();
  return json;
}

export async function fetchAllCategories(): Promise<string[]> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/metadata/tags"
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchMinMax(): Promise<Record<string, number>> {
  const response = await fetch("http://127.0.0.1:8000/dev/metadata/min_max")
  if (!response.ok) {
    throw new Error("Network response error");
  }
  const json: Record<string, number>[] = await response.json()
  console.log(json)
  const object = json.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.name]: currentValue.max }),
    {}
  );
  return object
}