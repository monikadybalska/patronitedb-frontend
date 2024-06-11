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

export async function fetchAllAuthorsData(): Promise<Author[]> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/top_authors"
  );
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

export async function fetchAllCategories(): Promise<string[]> {
  const response = await fetch(
    "https://j1xfrdkw06.execute-api.eu-north-1.amazonaws.com/prod/metadata/tags"
  );
  if (!response.ok) {
    throw new Error("Network response error");
  }
  return response.json();
}
