import { useState } from "react";
import { Layout } from "antd";
import { Grid, Button } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import SiderCustom from "./SiderCustom";
import ContentCustom from "./ContentCustom";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("0");
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Layout style={{ height: "100dvh" }}>
      <SiderCustom
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />
      <ContentCustom />
      {!screens.lg && collapsed && (
        <Button
          type="primary"
          icon={<MenuUnfoldOutlined />}
          onClick={() => setCollapsed(false)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid #1e3a8a",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 22,
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#1e3a8a",
          }}
        />
      )}
    </Layout>
  );
}
