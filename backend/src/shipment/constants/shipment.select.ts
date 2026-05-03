import { BASE_SELECT } from '../../common/constants/audit.select.js';

export const CLIENT_SELECT = {
  mask_uuid: true,
  name: true,
  email: true,
} as const;

export const PRODUCT_SELECT = {
  mask_uuid: true,
  name: true,
} as const;

export const LAND_SHIPMENT_SELECT = {
  vehicle_plate: true,
  warehouse: {
    select: {
      mask_uuid: true,
      name: true,
    },
  },
} as const;

export const SEA_SHIPMENT_SELECT = {
  fleet_number: true,
  port: {
    select: {
      mask_uuid: true,
      name: true,
    },
  },
} as const;

export const SHIPMENT_ITEM_SELECT = {
  mask_uuid: true,
  quantity: true,
  unit_price: true,
  total_price: true,
  product: {
    select: PRODUCT_SELECT,
  },
} as const;

// Base
export const SHIPMENT_SELECT = {
  type: true,
  registration_date: true,
  delivery_date: true,
  guide_number: true,
  base_price: true,
  discount_percent: true,
  discount_amount: true,
  total_price: true,
  ...BASE_SELECT,
} as const;

// Full view
export const SHIPMENT_DETAIL_SELECT = {
  ...SHIPMENT_SELECT,

  client: {
    select: CLIENT_SELECT,
  },

  shipment_item: {
    select: SHIPMENT_ITEM_SELECT,
  },

  land_shipment: {
    select: LAND_SHIPMENT_SELECT,
  },

  sea_shipment: {
    select: SEA_SHIPMENT_SELECT,
  },
} as const;
