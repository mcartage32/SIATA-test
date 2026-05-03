/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IBaseEntity, IPaginationParams } from "./common";

export interface IClient extends IBaseEntity {
  name: string;
  email: string;
  phone: string | null;
}
export interface IGetClientsParams extends IPaginationParams {}

export interface ICreateClientPayload {
  name: string;
  email: string;
  phone?: string | null;
}
export interface IUpdateClientPayload {
  name?: string;
  email?: string;
  phone?: string | null;
}
