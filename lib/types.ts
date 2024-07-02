export interface Author {
  image_url: string;
  is_recommended: "true" | "false";
  monthly_revenue: number;
  name: string;
  number_of_patrons: number;
  tags: string;
  time: number;
  total_revenue: number;
  url: string;
  increase?: number;
  number_of_patrons_gain: number;
  number_of_patrons_gain_percentage: number | null;
  monthly_revenue_gain: number;
  monthly_revenue_gain_percentage: number | null;
  total_revenue_gain: number;
  total_revenue_gain_percentage: number | null;
}

export type AuthorCriteria = Pick<
  Author,
  | "number_of_patrons"
  | "number_of_patrons_gain"
  | "number_of_patrons_gain_percentage"
  | "total_revenue"
  | "total_revenue_gain"
  | "total_revenue_gain_percentage"
  | "monthly_revenue"
  | "monthly_revenue_gain"
  | "monthly_revenue_gain_percentage"
>;

export type Order = "asc" | "desc";

export interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Author
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
