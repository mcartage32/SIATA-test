/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import {
  useWarehouseDetailQuery,
  useUpdateWarehouseMutation,
} from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
  maskuuid: string;
}

export const EditWarehouseModal = ({ open, onClose, maskuuid }: Props) => {
  const [form] = Form.useForm();
  const { data } = useWarehouseDetailQuery(maskuuid);
  const { mutate, isPending } = useUpdateWarehouseMutation();

  useEffect(() => {
    if (!open || !data) return;
    if (data) {
      form.setFieldsValue({
        name: data.name,
        location: data.location,
      });
    }
  }, [data, open]);

  const handleSubmit = (values: any) => {
    mutate(
      {
        maskuuid,
        payload: values,
      },
      {
        onSuccess: () => {
          createNotification.success({
            title: "Actualizado",
            description: "Bodega actualizada correctamente",
          });
          onClose();
        },
        onError: () => {
          createNotification.error({
            title: "Error",
            description: "No se pudo actualizar la bodega",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Editar Bodega</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Actualizar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="location" label="Ubicación">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
