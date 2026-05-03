import { Layout, theme } from "antd";
import { Outlet, useLocation } from "react-router-dom";

const { Content } = Layout;

export default function ContentCustom() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Content
      style={{
        height: "100dvh",
      }}
    >
      <div
        style={{
          height: "100%",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // importante
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {isHome && <div>Bienvenido</div>}
        <Outlet />
      </div>
    </Content>
  );
}
