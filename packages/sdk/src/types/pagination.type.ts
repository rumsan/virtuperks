export interface Pagination<T = Record<string, unknown>> {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: T;
  }
  type PaginationQuery = {
    pagination: Pagination;
    filters?: Record<string, unknown>;
  };
    