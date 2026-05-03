/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";
import { useCreateProductMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateProductModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateProductMutation();

  const handleSubmit = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        createNotification.success({
          title: "Producto creado",
          description: "El producto se creó correctamente",
        });
        form.resetFields();
        onClose();
      },
      onError: () => {
        createNotification.error({
          title: "Error",
          description: "No se pudo crear el producto",
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
        <div className="text-center text-lg font-semibold">Crear Producto</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Descripción">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
          <InputNumber
            className="w-full"
            min={1}
            controls={false}
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "Escape",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
              ];

              // Permitir teclas de control
              if (allowedKeys.includes(e.key)) return;

              // Permitir Ctrl/Cmd + A,C,V,X
              if (
                (e.ctrlKey || e.metaKey) &&
                ["a", "c", "v", "x"].includes(e.key.toLowerCase())
              ) {
                return;
              }

              // No permitir doble punto
              if (
                e.key === "." &&
                (e.currentTarget as HTMLInputElement).value.includes(".")
              ) {
                e.preventDefault();
                return;
              }
              // Permitir números y punto
              if (!/^[0-9.]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
