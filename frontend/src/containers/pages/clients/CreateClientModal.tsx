/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { useCreateClientMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { noOnlySpaces } from "@/utils/formValidators";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  phone?: string;
}

export const CreateClientModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm<FormValues>();
  const { mutate: createClient, isPending } = useCreateClientMutation();

  const handleSubmit = (values: FormValues) => {
    createClient(
      {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
      },
      {
        onSuccess: () => {
          createNotification.success({
            title: "Cliente creado",
            description: "El cliente se creó correctamente",
          });

          form.resetFields();
          onClose();
        },
        onError: (error) => {
          const message = error?.response?.data?.message;

          if (message === "Duplicate value violation") {
            createNotification.error({
              title: "Email duplicado",
              description: "Ya existe un cliente registrado con este email",
            });
            return;
          }

          createNotification.error({
            title: "Error",
            description: "No se pudo crear el cliente",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open]);

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Crear Cliente</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Crear"
      cancelText="Cancelar"
      destroyOnHidden
    >
      <Form<FormValues> form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: "El nombre es obligatorio" },
            noOnlySpaces("El nombre no puede contener solo espacios"),
          ]}
        >
          <Input placeholder="Ej: Juan Pérez" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "El email es obligatorio" },
            { type: "email", message: "Email inválido" },
          ]}
        >
          <Input placeholder="ejemplo@gmail.com" />
        </Form.Item>

        <Form.Item label="Teléfono" name="phone">
          <Input placeholder="Opcional" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
