/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IProduct } from "@/interfaces";

export const getProductColumns = ({
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  pageSize: number;
}): ColumnsType<IProduct> => [
  {
    title: "#",
    key: "index",
    align: "center",
    render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    title: "Nombre",
    dataIndex: "name",
  },
  {
    title: "Descripción",
    dataIndex: "description",
    render: (v: string) => v || "Sin información",
  },
  {
    title: "Precio (USD)",
    dataIndex: "price",
    render: (v: number) => `$ ${v}`,
  },
  {
    title: "Acciones",
    key: "actions",
    align: "center",
    render: (_: any, record: IProduct) => (
      <Space size="middle">
        <Tooltip title="Editar">
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer", fontSize: 18 }}
            onClick={() => onEdit(record.mask_uuid)}
          />
        </Tooltip>

        <Popconfirm
          title="¿Eliminar producto?"
          description="Esta acción no se puede deshacer"
          onConfirm={() => onDelete(record.mask_uuid)}
          okText="Sí"
          cancelText="No"
        >
          <Tooltip title="Eliminar">
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer", fontSize: 18 }}
            />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];
