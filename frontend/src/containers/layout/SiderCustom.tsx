import { Layout, Button, Grid } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import MenuSider from "./MenuSider";
import "./siderCustom.scss";

const { Sider } = Layout;

interface Props {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

export default function SiderCustom({
  collapsed,
  setCollapsed,
  selectedKey,
  setSelectedKey,
}: Props) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile, setCollapsed]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 80}
      width={215}
      style={{
        background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 80,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: 22,
            width: 48,
            height: 48,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <MenuSider selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
    </Sider>
  );
}
