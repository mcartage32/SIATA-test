import { BASE_SELECT } from '../../common/constants/audit.select.js';

export const PRODUCT_SELECT = {
  name: true,
  description: true,
  price: true,
  ...BASE_SELECT,
} as const;
