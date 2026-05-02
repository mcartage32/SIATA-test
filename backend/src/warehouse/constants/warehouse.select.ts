import { BASE_SELECT } from '../../common/constants/audit.select.js';

export const WAREHOUSE_SELECT = {
  name: true,
  location: true,
  ...BASE_SELECT,
} as const;
