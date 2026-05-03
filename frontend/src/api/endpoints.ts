const ENDPOINTS = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  CLIENTS_LIST: "/clients",
  CLIENTS_SELECT_OPTIONS: "/clients/select",
  CLIENTS_ID: (maskuuid: string) => `/clients/${maskuuid}`,
  PRODUCTS_LIST: "/products",
  PRODUCTS_SELECT_OPTIONS: "/products/select",
  PRODUCTS_ID: (maskuuid: string) => `/products/${maskuuid}`,
};

export default ENDPOINTS;
