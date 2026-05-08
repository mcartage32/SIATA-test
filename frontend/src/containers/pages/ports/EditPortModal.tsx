/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { usePortDetailQuery, useUpdatePortMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import { noOnlySpaces } from "@/utils/formValidators";

interface Props {
  open: boolean;
  onClose: () => void;
  maskuuid: string;
}

export interface FormValues {
  name?: string;
  location?: string | null;
}

export const EditPortModal = ({ open, onClose, maskuuid }: Props) => {
  const [form] = Form.useForm();
  const { data } = usePortDetailQuery(maskuuid);
  const { mutate, isPending } = useUpdatePortMutation();

  useEffect(() => {
    if (!open || !data) return;
    if (data) {
      form.setFieldsValue({
        name: data.name,
        location: data.location,
      });
    }
  }, [data, open]);

  const handleSubmit = (values: FormValues) => {
    mutate(
      {
        maskuuid,
        payload: values,
      },
      {
        onSuccess: () => {
          createNotification.success({
            title: "Actualizado",
            description: "Puerto actualizado correctamente",
          });
          onClose();
        },
        onError: () => {
          createNotification.error({
            title: "Error",
            description: "No se pudo actualizar",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Editar Puerto</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText="Actualizar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nombre"
          rules={[
            { required: true },
            noOnlySpaces("El nombre no puede estar vacío"),
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="location" label="Ubicación">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
