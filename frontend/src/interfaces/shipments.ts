/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IBaseEntity, IPaginationParams } from "./common";

export interface IGetShipmentsParams extends IPaginationParams {}

export type ShipmentType = "land" | "sea";

export interface IShipmentItem {
  mask_uuid: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  product: {
    mask_uuid: string;
    name: string;
  };
}

export interface ILandShipment {
  vehicle_plate: string;
  warehouse: {
    mask_uuid: string;
    name: string;
  };
}

export interface ISeaShipment {
  fleet_number: string;
  port: {
    mask_uuid: string;
    name: string;
  };
}

export interface IShipment extends IBaseEntity {
  type: ShipmentType;
  registration_date: string;
  delivery_date: string;
  guide_number: string;
  base_price: string;
  discount_percent: string;
  discount_amount: string;
  total_price: string;
  client: {
    mask_uuid: string;
    name: string;
    email: string;
  };
  shipment_item: IShipmentItem[];
  land_shipment: ILandShipment | null;
  sea_shipment: ISeaShipment | null;
}

export interface ICreateShipmentItemPayload {
  productMaskUuid: string;
  quantity: number;
}

export interface ICreateShipmentPayload {
  type: "land" | "sea";
  clientMaskUuid: string;
  deliveryDate: string;
  warehouseMaskUuid?: string;
  vehiclePlate?: string;
  portMaskUuid?: string;
  fleetNumber?: string;
  items: ICreateShipmentItemPayload[];
}

export interface IUpdateShipmentPayload {
  deliveryDate?: string;
  items?: {
    productMaskUuid: string;
    quantity: number;
  }[];
  vehiclePlate?: string;
  fleetNumber?: string;
  warehouseMaskUuid?: string;
  portMaskUuid?: string;
}
