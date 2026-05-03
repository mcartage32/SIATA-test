/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { useCreateWarehouseMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateWarehouseModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateWarehouseMutation();

  const handleSubmit = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        createNotification.success({
          title: "Bodega creada",
          description: "La bodega se creó correctamente",
        });
        form.resetFields();
        onClose();
      },
      onError: () => {
        createNotification.error({
          title: "Error",
          description: "No se pudo crear la bodega",
        });
      },
    });
  };

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open]);

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Crear Bodega</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
