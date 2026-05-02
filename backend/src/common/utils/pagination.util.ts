export interface PaginationParams {
  page?: number;
  limit?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function getPagination(params: PaginationParams) {
  const page = params.page && params.page > 0 ? params.page : DEFAULT_PAGE;
  const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}
