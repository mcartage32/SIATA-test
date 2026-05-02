export const AUDIT_SELECT = {
  created_at: true,
  created_by: true,
  updated_by: true,
  updated_at: true,
} as const;

export const BASE_SELECT = {
  mask_uuid: true,
  ...AUDIT_SELECT,
} as const;
