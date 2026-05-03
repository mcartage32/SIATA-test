import { PUBLIC_ROUTE } from "@/constants";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (Boolean(sessionStorage.getItem("access_token") ?? null))
    return <Outlet />;

  return <Navigate replace to={PUBLIC_ROUTE.LOGIN} />;
};

export default PrivateRoute;
