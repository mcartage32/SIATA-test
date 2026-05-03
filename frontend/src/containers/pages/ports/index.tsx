/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "antd";
import { TableCustom } from "@/components/TableCustom";
import { usePortsListQuery, useDeletePortMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { getPortColumns } from "./PortColumns";
import { CreatePortModal } from "./CreatePortModal";
import { EditPortModal } from "./EditPortModal";

const PortsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState("");

  const { data, isLoading } = usePortsListQuery({ page, limit });
  const { mutate: deletePort } = useDeletePortMutation();

  const handleDelete = (maskuuid: string) => {
    deletePort(maskuuid, {
      onSuccess: () => {
        createNotification.success({
          title: "Eliminado",
          description: "Puerto eliminado correctamente",
        });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        if (message === "Entity is used in shipments") {
          createNotification.error({
            title: "Error",
            description:
              "No se puede eliminar este puerto porque está asociado a envíos.",
          });
          return;
        }

        createNotification.error({
          title: "Error",
          description: "No se pudo eliminar el puerto.",
        });
      },
    });
  };

  return (
    <>
      <TableCustom
        title="Puertos"
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pageSize={limit}
        onPageChange={(p, s) => {
          setPage(p);
          setLimit(s);
        }}
        columns={getPortColumns({
          currentPage: page,
          pageSize: limit,
          onEdit: (id) => {
            setSelected(id);
            setOpenEdit(true);
          },
          onDelete: handleDelete,
        })}
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            Crear puerto
          </Button>
        }
      />

      <CreatePortModal open={openCreate} onClose={() => setOpenCreate(false)} />

      <EditPortModal
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

export default PortsPage;
