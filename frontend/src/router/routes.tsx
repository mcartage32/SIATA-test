/* eslint-disable react-refresh/only-export-components */
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "@/constants";
import { lazy } from "react";

// Componentes de prueba
const Login = lazy(() => import("@/containers/pages/auth/Login"));
const Dashboard = () => <div>Dashboard Page</div>;
const Appointments = () => <div>Appointments Page</div>;
const Reports = () => <div>Reports Page</div>;

// Rutas publicas
export const publicRoutes: { component: React.FC; path: string }[] = [
  {
    path: PUBLIC_ROUTE.LOGIN,
    component: Login,
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
    path: PRIVATE_ROUTE.DASHBOARD,
    component: Dashboard,
  },
  {
    path: PRIVATE_ROUTE.APPOINTMENTS,
    component: Appointments,
  },
  {
    path: PRIVATE_ROUTE.REPORTS,
    component: Reports,
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
