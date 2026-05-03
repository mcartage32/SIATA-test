/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IBaseEntity, IPaginationParams } from "./common";

export interface IProduct extends IBaseEntity {
  name: string;
  description: string | null;
  price: number;
}

export interface IGetProductsParams extends IPaginationParams {}

export interface ICreateProductPayload {
  name: string;
  price: number;
  description?: string | null;
}

export interface IUpdateProductPayload {
  name?: string;
  price?: number;
  description?: string | null;
}
