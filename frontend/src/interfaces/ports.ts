/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IBaseEntity, IPaginationParams } from "./common";

export interface IPort extends IBaseEntity {
  name: string;
  location: string | null;
}

export interface IGetPortsParams extends IPaginationParams {}

export interface ICreatePortPayload {
  name: string;
  location?: string | null;
}

export interface IUpdatePortPayload {
  name?: string;
  location?: string | null;
}
