import { useState } from "react";
import { Button } from "antd";
import { useClientsListQuery, useDeleteClientMutation } from "@/api/reactQuery";
import { TableCustom } from "@/components/TableCustom";
import { getClientColumns } from "./ClientColumns";
import { CreateClientModal } from "./CreateClientModal";
import { createNotification } from "@/components/NotificationCustom";
import { EditClientModal } from "./EditClientModal";

const ClientsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { mutate: deleteClient } = useDeleteClientMutation();
  const { data, isLoading } = useClientsListQuery({
    page,
    limit,
  });

  // Funcion para abrir el modal desde la columna
  const handleEdit = (id: string) => {
    setSelectedClient(id);
    setOpenEdit(true);
  };
  // Ejecuta la mutacion delete directamente
  const handleDelete = (maskuuid: string) => {
    deleteClient(maskuuid, {
      onSuccess: () => {
        createNotification.success({
          title: "Eliminado",
          description: "Cliente eliminado correctamente",
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const message = error?.response?.data?.message;
        if (message === "Entity is used in shipments") {
          createNotification.error({
            title: "Erro",
            description:
              "No se puede eliminar este cliente ya que tiene envios asociados.",
          });
          return;
        }
        createNotification.error({
          title: "Error",
          description: "No se pudo eliminar este cliente.",
        });
      },
    });
  };

  return (
    <>
      <TableCustom
        title="Clientes"
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pageSize={limit}
        onPageChange={(p, size) => {
          setPage(p);
          setLimit(size);
        }}
        columns={getClientColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
          currentPage: page,
          pageSize: limit,
        })}
        extra={
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            Crear cliente
          </Button>
        }
      />
      <CreateClientModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <EditClientModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedClient("");
        }}
        maskuuid={selectedClient}
      />
    </>
  );
};

export default ClientsPage;
