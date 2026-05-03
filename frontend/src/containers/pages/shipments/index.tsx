import { useState } from "react";
import { Button } from "antd";
import { TableCustom } from "@/components/TableCustom";
import { getShipmentColumns } from "./ShipmentColumns";
import {
  useDeleteShipmentMutation,
  useShipmentsListQuery,
} from "@/api/reactQuery/shipments";
import { CreateShipmentModal } from "./CreateShipmentModal";
import { createNotification } from "@/components/NotificationCustom";
import { EditShipmentModal } from "./EditShipmentModal";

const ShipmentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState("");

  const { data, isLoading } = useShipmentsListQuery({
    page,
    limit,
  });

  const { mutate: deleteShipment } = useDeleteShipmentMutation();

  const handleDelete = (maskuuid: string) => {
    deleteShipment(maskuuid, {
      onSuccess: () => {
        createNotification.success({
          title: "Eliminado",
          description: "Envío eliminado correctamente",
        });
      },
      onError: () => {
        createNotification.error({
          title: "Error",
          description: "No se pudo eliminar el envío",
        });
      },
    });
  };

  return (
    <>
      <TableCustom
        title="Envíos"
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pageSize={limit}
        onPageChange={(p, s) => {
          setPage(p);
          setLimit(s);
        }}
        columns={getShipmentColumns({
          currentPage: page,
          pageSize: limit,
          onEdit: (maskuuid) => {
            setSelected(maskuuid);
            setOpenEdit(true);
          },
          onDelete: handleDelete,
        })}
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            Crear envío
          </Button>
        }
      />
      <CreateShipmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <EditShipmentModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected("");
        }}
        maskuuid={selected}
      />
    </>
  );
};

export default ShipmentsPage;
