import { useState } from "react";
import { Button } from "antd";
import { TableCustom } from "@/components/TableCustom";
import {
  useProductsListQuery,
  useDeleteProductMutation,
} from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { getProductColumns } from "./ProductColumns";
import { CreateProductModal } from "./CreateProductModal";
import { EditProductModal } from "./EditProductModal";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState("");
  const { data, isLoading } = useProductsListQuery({ page, limit });
  const { mutate: deleteProduct } = useDeleteProductMutation();

  const handleDelete = (maskuuid: string) => {
    deleteProduct(maskuuid, {
      onSuccess: () => {
        createNotification.success({
          title: "Eliminado",
          description: "Producto eliminado correctamente",
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        if (message === "Entity is used in shipments") {
          createNotification.error({
            title: "Error",
            description:
              "No se puede eliminar este producto porque está asociado a envíos.",
          });
          return;
        }

        createNotification.error({
          title: "Error",
          description: "No se pudo eliminar el producto.",
        });
      },
    });
  };

  return (
    <>
      <TableCustom
        title="Productos"
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pageSize={limit}
        onPageChange={(p, s) => {
          setPage(p);
          setLimit(s);
        }}
        columns={getProductColumns({
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
            Crear producto
          </Button>
        }
      />

      <CreateProductModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditProductModal
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

export default ProductsPage;
