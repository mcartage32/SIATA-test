/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IBaseEntity, IPaginationParams } from "./common";

export interface IWarehouse extends IBaseEntity {
  name: string;
  location: string | null;
}

export interface IGetWarehousesParams extends IPaginationParams {}

export interface ICreateWarehousePayload {
  name: string;
  location?: string | null;
}

export interface IUpdateWarehousePayload {
  name?: string;
  location?: string | null;
}
