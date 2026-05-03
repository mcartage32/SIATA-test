/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import {
  useUpdateClientMutation,
  useClientDetailQuery,
} from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
  maskuuid: string;
}

interface FormValues {
  name: string;
  email: string;
  phone?: string;
}

export const EditClientModal = ({ open, onClose, maskuuid }: Props) => {
  const [form] = Form.useForm<FormValues>();

  const { data } = useClientDetailQuery(maskuuid);
  const { mutate: updateClient, isPending } = useUpdateClientMutation();

  useEffect(() => {
    if (!open || !data) return;

    form.setFieldsValue({
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
    });
  }, [data, open]);

  const handleSubmit = (values: FormValues) => {
    if (!maskuuid) return;

    updateClient(
      {
        maskuuid,
        payload: {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
        },
      },
      {
        onSuccess: () => {
          createNotification.success({
            title: "Cliente actualizado",
            description: "El cliente fue actualizado correctamente",
          });

          onClose();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message === "Duplicate value violation"
              ? "Ya existe un cliente registrado con este email"
              : "Error al actualizar cliente";

          createNotification.error({
            title: "Error",
            description: message,
          });
        },
      },
    );
  };

  return (
    <Modal
      title={<div className="text-center font-semibold">Editar cliente</div>}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Actualizar"
      cancelText="Cancelar"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Teléfono">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
