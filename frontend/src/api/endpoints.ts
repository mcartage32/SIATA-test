const ENDPOINTS = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  CLIENTS_LIST: "/clients",
  CLIENTS_SELECT_OPTIONS: "/clients/select",
  CLIENTS_ID: (maskuuid: string) => `/clients/${maskuuid}`,
};

export default ENDPOINTS;
