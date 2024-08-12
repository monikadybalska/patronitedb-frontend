import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Author } from "./types";
import { queryOptions } from "@tanstack/react-query";

const getURL = (endpoint: string) => {
  // return new URL(endpoint, "https://patronitedb-api.vercel.app/");
  return new URL(endpoint, "http://localhost:3000/");
};

export async function fetchPatronsGainByUrl(url: string): Promise<Author[]> {
  const response = await fetch(
    getURL(`gain?criterion=number_of_patrons&url=${url}`)
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchMonthlyRevenueGainByUrl(
  url: string
): Promise<Author[]> {
  const response = await fetch(
    getURL(`gain?criterion=monthly_revenue&url=${url}`)
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchAuthorByUrl(url: string) {
  const response = await fetch(getURL(`author?url=${url}`));
  if (!response.ok) {
    throw new Error("Network response error");
  }
  const json: Author[] = await response.json();
  if (json.length === 0) {
    throw new Error("Author not found");
  }
  return json;
}

export const authorQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ["author overview", url],
    queryFn: () => fetchAuthorByUrl(url),
  });

export async function fetchTopAuthors({
  criteria,
}: {
  criteria: string;
}): Promise<Author[] | null> {
  const response = await fetch(
    getURL(`top_authors?criterion=${criteria}&offset=0&limit=10`)
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchTrendingAuthors({
  criterion,
  days,
  sort,
}: {
  criterion: keyof Author;
  days: number;
  sort: "desc" | "asc";
}): Promise<Author[] | null> {
  const url = getURL(
    `trending_authors?criterion=${criterion}&days=${days}&order=${sort}`
  );
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchAllAuthorsData({
  sorting,
  pageParam,
  pageSize,
  columnFilters,
}: {
  sorting: SortingState;
  pageParam: number;
  pageSize: number;
  columnFilters: ColumnFiltersState;
}): Promise<Author[]> {
  const filters: Record<string, number[]> = columnFilters.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.id]: currentValue.value }),
    {}
  );
  const url = getURL("top_authors");
  filters["name"] &&
    url.searchParams.set("name", `${filters["name"].toString().toLowerCase()}`);
  sorting.length > 0 && url.searchParams.set("criterion", `${sorting[0].id}`);
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

  const response = await fetch(url.href);

  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchAllAuthors(): Promise<
  Pick<Author, "name" | "url">[]
> {
  const response = await fetch(getURL("/authors"));
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
  const url = getURL("/row_count");
  filters["name"] && url.searchParams.set("name", `${filters["name"]}`);
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
  const json: string[] = await response.json();
  return json.length;
}

export async function fetchAllCategories(): Promise<string[]> {
  const response = await fetch(getURL("categories"));
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}

export async function fetchMinMax(): Promise<Record<string, number>> {
  const response = await fetch(getURL("min_max"));
  if (!response.ok) {
    throw new Error("Network response error");
  }
  const json: Record<string, number>[] = await response.json();
  const object = json.reduce(
    (accumulator, currentValue) =>
      Object.assign(accumulator, { [currentValue.name]: currentValue.max }),
    {}
  );
  return object;
}
