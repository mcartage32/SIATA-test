/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space, Tooltip, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IShipment } from "@/interfaces";

export const getShipmentColumns = ({
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}): ColumnsType<IShipment> => [
  {
    title: "#",
    key: "index",
    align: "center",
    render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    title: "Tipo",
    dataIndex: "type",
    align: "center",
    render: (value: "land" | "sea") =>
      value === "land" ? (
        <Tag color="green">Terrestre</Tag>
      ) : (
        <Tag color="blue">Marítimo</Tag>
      ),
  },
  {
    title: "Cliente",
    key: "client",
    render: (_, record) => record.client?.name,
  },
  {
    title: "Fecha de registro",
    dataIndex: "created_at",
    align: "center",
    render: (value: string) => value.split("T")[0],
  },
  {
    title: "Guía",
    dataIndex: "guide_number",
    align: "center",
  },
  {
    title: "Productos (cantidad)",
    key: "products",
    render: (_, record) => {
      if (!record.shipment_item.length) return "Sin productos";

      return (
        <div className="flex flex-col gap-1">
          {record.shipment_item.map((item, index) => (
            <div key={item.mask_uuid} className="flex items-center gap-2">
              <span className="text-sm">
                {index + 1}. {item.product.name}
              </span>

              <Tag color="geekblue">{item.quantity}</Tag>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: "Fecha de entrega",
    dataIndex: "delivery_date",
    align: "center",
    render: (value: string) => value.split("T")[0],
  },
  {
    title: "Sitio de entrega",
    key: "origin",
    render: (_, record) => {
      if (record.type === "land") {
        return record.land_shipment?.warehouse?.name || "Sin bodega";
      }

      if (record.type === "sea") {
        return record.sea_shipment?.port?.name || "Sin puerto";
      }

      return "-";
    },
  },
  {
    title: "Vehículo",
    key: "vehicle",
    align: "center",
    render: (_, record) => {
      if (record.type === "land") {
        const plate = record.land_shipment?.vehicle_plate;
        return plate ? `Vehículo: ${plate}` : "Sin placa";
      }

      if (record.type === "sea") {
        const fleet = record.sea_shipment?.fleet_number;
        return fleet ? `Flota # ${fleet}` : "Sin número de flota";
      }

      return "-";
    },
  },
  {
    title: "Descuento",
    dataIndex: "discount_amount",
    align: "center",
    render: (value: string) => `$ ${value}`,
  },
  {
    title: "Precio total (USD)",
    dataIndex: "total_price",
    align: "center",
    render: (value: string) => `$ ${value}`,
  },
  {
    title: "Acciones",
    key: "actions",
    align: "center",
    render: (_: any, record: IShipment) => {
      return (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined
              style={{
                color: "#1677ff",
                cursor: "pointer",
                fontSize: 18,
              }}
              onClick={() => onEdit(record.mask_uuid)}
            />
          </Tooltip>

          <Popconfirm
            title="¿Eliminar envío?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => onDelete(record.mask_uuid)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title="Eliminar">
              <DeleteOutlined
                style={{
                  color: "#ff4d4f",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      );
    },
  },
];
