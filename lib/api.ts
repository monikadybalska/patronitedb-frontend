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
