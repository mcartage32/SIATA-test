import { Spin } from "antd";
import { Suspense, type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import PrivateRoute from "./PrivateRoute";
import Home from "@/containers/layout/Home";

const Router = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spin />}>
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              Component={route.component}
              key={route.path}
              path={route.path}
            />
          ))}
          <Route element={<PrivateRoute />}>
            <Route element={<Home />} path="/">
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                >
                  {route.children?.map((child) => (
                    <Route
                      path={child.path}
                      element={<child.component />}
                      key={`${route.path}/${child.path}`}
                    />
                  ))}
                </Route>
              ))}
            </Route>
          </Route>
          <Route path="*" element={<div>Pagina no encontrada</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
