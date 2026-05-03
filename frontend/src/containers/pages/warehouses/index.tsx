/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "antd";
import { TableCustom } from "@/components/TableCustom";
import {
  useWarehousesListQuery,
  useDeleteWarehouseMutation,
} from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { getWarehouseColumns } from "./WarehouseColumns";
import { CreateWarehouseModal } from "./CreateWarehouseModal";
import { EditWarehouseModal } from "./EditWarehouseModal";

const WarehousesPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState("");

  const { data, isLoading } = useWarehousesListQuery({ page, limit });
  const { mutate: deleteWarehouse } = useDeleteWarehouseMutation();

  const handleDelete = (maskuuid: string) => {
    deleteWarehouse(maskuuid, {
      onSuccess: () => {
        createNotification.success({
          title: "Eliminado",
          description: "Bodega eliminada correctamente",
        });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        if (message === "Entity is used in shipments") {
          createNotification.error({
            title: "Error",
            description:
              "No se puede eliminar esta bodega porque está asociada a envíos.",
          });
          return;
        }

        createNotification.error({
          title: "Error",
          description: "No se pudo eliminar la bodega.",
        });
      },
    });
  };

  return (
    <>
      <TableCustom
        title="Bodegas"
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pageSize={limit}
        onPageChange={(p, s) => {
          setPage(p);
          setLimit(s);
        }}
        columns={getWarehouseColumns({
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
            Crear bodega
          </Button>
        }
      />

      <CreateWarehouseModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditWarehouseModal
        open={openEdit}
        maskuuid={selected}
        onClose={() => {
          setOpenEdit(false);
          setSelected("");
        }}
      />
    </>
  );
};

export default WarehousesPage;
