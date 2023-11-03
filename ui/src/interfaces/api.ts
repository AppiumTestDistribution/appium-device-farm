export type ApiResponse<T> = {
  success: boolean;
  result: T;
};

export type PaginatedResponse<T> = {
  count: number;
  rows: T[];
};
