export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IBaseEntity {
  mask_uuid: string;
  created_at: string;
  created_by: string | null;
  updated_by: string | null;
  updated_at: string | null;
}

export interface IPaginatedResponse<T> extends IPaginationMeta {
  data: T[];
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface ISelectOption {
  mask_uuid: string;
  name: string;
}
