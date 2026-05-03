import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
// import { PUBLIC_ROUTE } from "@/constants";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuUserRoundCheck } from "react-icons/lu";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineBallot, MdLogout } from "react-icons/md";

interface Props {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

export default function MenuSider({ selectedKey, setSelectedKey }: Props) {
  const navigate = useNavigate();

  //   const handleMenuClick = ({ key }: { key: string }) => {
  //     setSelectedKey(key);
  //     switch (key) {
  //       case "1":
  //         navigate(PUBLIC_ROUTE.HOME);
  //         break;
  //       case "2":
  //         navigate(PUBLIC_ROUTE.USERS);
  //         break;
  //       case "3":
  //         navigate(PUBLIC_ROUTE.BOOKS);
  //         break;
  //       case "4":
  //         navigate(PUBLIC_ROUTE.RESERVATIONS_GENERAL);
  //         break;
  //       case "5":
  //         navigate(PUBLIC_ROUTE.RESERVATIONS_BY_USER);
  //         break;
  //       case "6":
  //         navigate(PUBLIC_ROUTE.RESERVATIONS_BY_BOOK);
  //         break;
  //     }
  //   };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        navigate("/dashboard");
        break;
      case "2":
        navigate("/clients");
        break;
      case "3":
        navigate("/products");
        break;
      case "4":
        navigate("/shipments");
        break;
      case "5":
        navigate("/shipments/land");
        break;
      case "6":
        navigate("/shipments/sea");
        break;
      case "logout":
        sessionStorage.removeItem("access_token");
        navigate("/login");
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
          icon: <IoHomeOutline size={22} />,
          label: "Home",
        },
        {
          key: "2",
          icon: <FaRegUser size={22} />,
          label: "Usuarios",
        },
        {
          key: "3",
          icon: <FaBook size={18} />,
          label: "Libros",
        },
        {
          key: "333",
          icon: <FaRegCalendarCheck size={18} />,
          label: "Reservas",
          children: [
            {
              key: "4",
              icon: <MdOutlineBallot size={18} />,
              label: "General",
            },
            {
              key: "5",
              icon: <LuUserRoundCheck size={18} />,
              label: "Por usuario",
            },
            {
              key: "6",
              icon: <LuNotebookPen size={18} />,
              label: "Por libro",
            },
          ],
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <MdLogout size={20} color="red" />,
          label: "Cerrar sesión",
          danger: true,
        },
      ]}
    />
  );
}
