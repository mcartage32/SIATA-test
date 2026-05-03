import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { PRIVATE_ROUTE } from "@/constants";
import { MdProductionQuantityLimits } from "react-icons/md";
import { IoIosBoat } from "react-icons/io";
import { MdWarehouse } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";

interface Props {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

export default function MenuSider({ selectedKey, setSelectedKey }: Props) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const ICON_SIZE = 22;

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate(PRIVATE_ROUTE.HOME);
        break;
      case "2":
        navigate(PRIVATE_ROUTE.CLIENTS);
        break;
      case "3":
        navigate(PRIVATE_ROUTE.PRODUCTS);
        break;
      case "4":
        navigate(PRIVATE_ROUTE.PORTS);
        break;
      case "5":
        navigate(PRIVATE_ROUTE.WAREHOUSES);
        break;
      case "6":
        navigate(PRIVATE_ROUTE.SHIPMENTS);
        break;
      case "logout":
        logout();
        break;
    }
  };

  return (
    <Menu
      mode="inline"
      style={{
        background: "transparent",
        borderRight: "none",
      }}
      selectedKeys={[selectedKey]}
      onClick={handleMenuClick}
      items={[
        {
          key: "1",
          icon: <IoHomeOutline size={ICON_SIZE} />,
          label: "Home",
        },
        {
          key: "2",
          icon: <FaRegUser size={ICON_SIZE} />,
          label: "Clientes",
        },
        {
          key: "3",
          icon: <MdProductionQuantityLimits size={ICON_SIZE} />,
          label: "Productos",
        },
        {
          key: "4",
          icon: <IoIosBoat size={ICON_SIZE} />,
          label: "Puertos",
        },
        {
          key: "5",
          icon: <MdWarehouse size={ICON_SIZE} />,
          label: "Bodegas",
        },
        {
          key: "6",
          icon: <FaShippingFast size={ICON_SIZE} />,
          label: "Envios",
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <MdLogout size={ICON_SIZE} color="red" />,
          label: "Cerrar sesión",
          danger: true,
        },
      ]}
    />
  );
}
