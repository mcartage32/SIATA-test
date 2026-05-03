const ENDPOINTS = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  CLIENTS_LIST: "/clients",
  CLIENTS_SELECT_OPTIONS: "/clients/select",
  CLIENTS_ID: (maskuuid: string) => `/clients/${maskuuid}`,
  PRODUCTS_LIST: "/products",
  PRODUCTS_SELECT_OPTIONS: "/products/select",
  PRODUCTS_ID: (maskuuid: string) => `/products/${maskuuid}`,
  PORTS_LIST: "/ports",
  PORTS_ID: (maskuuid: string) => `/ports/${maskuuid}`,
  PORTS_SELECT_OPTIONS: "/ports/select",
  WAREHOUSES_LIST: "/warehouses",
  WAREHOUSES_SELECT_OPTIONS: "/warehouses/select",
  WAREHOUSES_ID: (maskuuid: string) => `/warehouses/${maskuuid}`,
};

export default ENDPOINTS;
