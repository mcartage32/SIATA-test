/* eslint-disable react-refresh/only-export-components */
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "@/constants";
import { lazy } from "react";

const Login = lazy(() => import("@/containers/pages/auth/Login"));
const Register = lazy(() => import("@/containers/pages/auth/Register"));
const Clients = lazy(() => import("@/containers/pages/clients"));
const Products = lazy(() => import("@/containers/pages/products"));
const Ports = lazy(() => import("@/containers/pages/ports"));
const Warehouses = lazy(() => import("@/containers/pages/warehouses"));
const Shipments = lazy(() => import("@/containers/pages/shipments"));

// Rutas publicas
export const publicRoutes: { component: React.FC; path: string }[] = [
  {
    path: PUBLIC_ROUTE.LOGIN,
    component: Login,
  },
  {
    path: PUBLIC_ROUTE.REGISTER,
    component: Register,
  },
];

// Rutas privadas
export const privateRoutes: {
  path: string;
  component: React.FC;
  children?: {
    path: string;
    component: React.FC;
  }[];
}[] = [
  {
    path: PRIVATE_ROUTE.CLIENTS,
    component: Clients,
  },
  {
    path: PRIVATE_ROUTE.PRODUCTS,
    component: Products,
  },
  {
    path: PRIVATE_ROUTE.PORTS,
    component: Ports,
  },
  {
    path: PRIVATE_ROUTE.WAREHOUSES,
    component: Warehouses,
  },
  {
    path: PRIVATE_ROUTE.SHIPMENTS,
    component: Shipments,
  },
  //   {
  //     path: PRIVATE_ROUTE.PROSPECTS,
  //     component: ProspectManagement,
  //     children: [
  //       {
  //         path: PRIVATE_ROUTE.PROSPECTS_DELETION_MODAL,
  //         component: ProspectDeletionModal,
  //       },
  //       {
  //         path: PRIVATE_ROUTE.PROSPECTS_DISCARD_MODAL,
  //         component: ProspectDiscardModal,
  //       },
  //     ],
  //   },
  //   {
  //     path: PRIVATE_ROUTE.CONFIGURATION,
  //     component: ConfigurationComponent,
  //     permission: PERMISSIONS.SETTINGS,
  //     children: [
  //       {
  //         path: ":url",
  //         component: MasterTableSwitch,
  //       },
  //     ],
  //   },
];
