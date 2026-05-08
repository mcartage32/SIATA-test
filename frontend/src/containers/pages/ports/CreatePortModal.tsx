/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { useCreatePortMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  location?: string | null;
}

export const CreatePortModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreatePortMutation();

  const handleSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        createNotification.success({
          title: "Puerto creado",
          description: "El puerto fue creado correctamente",
        });
        form.resetFields();
        onClose();
      },
      onError: () => {
        createNotification.error({
          title: "Error",
          description: "No se pudo crear el puerto",
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
        <div className="text-center text-lg font-semibold">Crear Puerto</div>
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
