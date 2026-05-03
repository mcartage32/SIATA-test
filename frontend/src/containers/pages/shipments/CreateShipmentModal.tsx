/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  useClientsSelectOptionsQuery,
  useProductsSelectOptionsQuery,
  usePortsSelectOptionsQuery,
  useWarehousesSelectOptionsQuery,
} from "@/api/reactQuery";
import { useCreateShipmentMutation } from "@/api/reactQuery/shipments";
import { createNotification } from "@/components/NotificationCustom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateShipmentModal = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();
  const type = Form.useWatch("type", form);
  const { mutate, isPending } = useCreateShipmentMutation();
  const [width, setWidth] = useState(280);

  // queries para selects
  const { data: clients } = useClientsSelectOptionsQuery();
  const { data: products } = useProductsSelectOptionsQuery();
  const { data: ports } = usePortsSelectOptionsQuery();
  const { data: warehouses } = useWarehousesSelectOptionsQuery();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      deliveryDate: values.deliveryDate.format("YYYY-MM-DD"),
      items: values.items.map((item: any) => ({
        productMaskUuid: item.productMaskUuid,
        quantity: Number(item.quantity),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        createNotification.success({
          title: "Envío creado",
          description: "El envío se creó correctamente",
        });

        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        if (message === "Duplicate products are not allowed") {
          createNotification.error({
            title: "Error",
            description: "Hay productos duplicados. Por favor reviselos",
          });
          return;
        }

        createNotification.error({
          title: "Error",
          description: "No se pudo crear el envío.",
        });
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? 150 : 280);
    };
    handleResize(); // inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open]);

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Crear Envío</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      loading={isPending}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* TYPE */}
        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Terrestre", value: "land" },
              { label: "Marítimo", value: "sea" },
            ]}
          />
        </Form.Item>

        {/* CLIENT */}
        <Form.Item
          name="clientMaskUuid"
          label="Cliente"
          rules={[{ required: true }]}
        >
          <Select
            showSearch={{
              optionFilterProp: "label",
            }}
            options={clients?.map((c) => ({
              label: c.name,
              value: c.mask_uuid,
            }))}
          />
        </Form.Item>

        {/* DELIVERY DATE */}
        <Form.Item
          name="deliveryDate"
          label="Fecha de entrega"
          rules={[{ required: true }]}
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>

        {/* LAND */}
        {type === "land" && (
          <>
            <Form.Item
              name="warehouseMaskUuid"
              label="Bodega"
              rules={[{ required: true }]}
            >
              <Select
                showSearch={{
                  optionFilterProp: "label",
                }}
                options={warehouses?.map((w) => ({
                  label: w.name,
                  value: w.mask_uuid,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="vehiclePlate"
              label="Placa"
              rules={[
                { required: true },
                {
                  pattern: /^[A-Z]{3}[0-9]{3}$/,
                  message: "Formato inválido (AAA123)",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {/* SEA */}
        {type === "sea" && (
          <>
            <Form.Item
              name="portMaskUuid"
              label="Puerto"
              rules={[{ required: true }]}
            >
              <Select
                showSearch={{
                  optionFilterProp: "label",
                }}
                options={ports?.map((p) => ({
                  label: p.name,
                  value: p.mask_uuid,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="fleetNumber"
              label="Número de flota"
              rules={[
                { required: true },
                {
                  pattern: /^[A-Z]{3}[0-9]{4}[A-Z]$/,
                  message: "Formato inválido (AAA1234A)",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {/* ITEMS */}
        <Form.List name="items" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <div className="text-center font-medium mb-2">Productos</div>
              <div className="flex flex-col gap-2">
                {fields.map((field) => (
                  <Space key={field.key} className="flex" align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, "productMaskUuid"]}
                      rules={[{ required: true }]}
                    >
                      <Select
                        style={{ width }}
                        showSearch={{
                          optionFilterProp: "label",
                        }}
                        placeholder="Producto"
                        options={products?.map((p) => ({
                          label: p.name,
                          value: p.mask_uuid,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "quantity"]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        className="w-full"
                        min={1}
                        controls={false}
                        placeholder="Cantidad"
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

                          if (allowedKeys.includes(e.key)) return;

                          if (
                            (e.ctrlKey || e.metaKey) &&
                            ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                          ) {
                            return;
                          }

                          if (
                            e.key === "." &&
                            (
                              e.currentTarget as HTMLInputElement
                            ).value.includes(".")
                          ) {
                            e.preventDefault();
                            return;
                          }

                          if (!/^[0-9.]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)}>
                      X
                    </Button>
                  </Space>
                ))}
              </div>

              <Button type="dashed" onClick={() => add()}>
                + Agregar producto
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
