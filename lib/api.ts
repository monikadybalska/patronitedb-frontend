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
  const filters: Record<string, number[]> = columnFilters.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.id]: currentValue.value }),
    {}
  );
  const url = new URL("/dev/top_authors", "http://127.0.0.1:8000");
  sorting.length > 0 && url.searchParams.set("criteria", `${sorting[0].id}`);
  sorting.length > 0 &&
    url.searchParams.set("order", sorting[0].desc ? "desc" : "asc");
  url.searchParams.set("offset", `${(pageParam as number) * pageSize}`);
  url.searchParams.set("limit", `${pageSize}`);
  filters["total_revenue"] &&
    url.searchParams.set("min_total_revenue", `${filters["total_revenue"][0]}`);
  filters["total_revenue"] &&
    url.searchParams.set("max_total_revenue", `${filters["total_revenue"][1]}`);

  console.log(pageParam);
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

export async function fetchNumberofAuthors(): Promise<number> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/metadata/authors"
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  const json: Author[] = await response.json();
  return json.length;
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
