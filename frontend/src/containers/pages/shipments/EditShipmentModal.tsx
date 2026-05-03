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
import { createNotification } from "@/components/NotificationCustom";
import {
  useShipmentDetailQuery,
  useUpdateShipmentMutation,
} from "@/api/reactQuery/shipments";

interface Props {
  open: boolean;
  onClose: () => void;
  maskuuid: string;
}

export const EditShipmentModal = ({ open, onClose, maskuuid }: Props) => {
  const [form] = Form.useForm();
  const [width, setWidth] = useState(280);

  const { data } = useShipmentDetailQuery(maskuuid);
  const { mutate, isPending } = useUpdateShipmentMutation();

  const { data: clients } = useClientsSelectOptionsQuery();
  const { data: products } = useProductsSelectOptionsQuery();
  const { data: ports } = usePortsSelectOptionsQuery();
  const { data: warehouses } = useWarehousesSelectOptionsQuery();

  const type = Form.useWatch("type", form);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 768 ? 150 : 280);
    };
    handleResize(); // inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      type: data.type,
      clientMaskUuid: data.client.mask_uuid,
      deliveryDate: dayjs(data.delivery_date),

      vehiclePlate: data.land_shipment?.vehicle_plate,
      warehouseMaskUuid: data.land_shipment?.warehouse?.mask_uuid,

      fleetNumber: data.sea_shipment?.fleet_number,
      portMaskUuid: data.sea_shipment?.port?.mask_uuid,

      items: data.shipment_item.map((item: any) => ({
        productMaskUuid: item.product.mask_uuid,
        quantity: item.quantity,
      })),
    });
  }, [data]);

  const handleSubmit = (values: any) => {
    const payload: any = {
      deliveryDate: values.deliveryDate.format("YYYY-MM-DD"),
    };

    // LAND
    if (values.type === "land") {
      payload.vehiclePlate = values.vehiclePlate;
      payload.warehouseMaskUuid = values.warehouseMaskUuid;
    }

    // SEA
    if (values.type === "sea") {
      payload.fleetNumber = values.fleetNumber;
      payload.portMaskUuid = values.portMaskUuid;
    }

    // ITEMS
    payload.items = values.items;

    mutate(
      {
        maskuuid,
        payload,
      },
      {
        onSuccess: () => {
          createNotification.success({
            title: "Envío actualizado",
            description: "El envío fue actualizado correctamente",
          });
          onClose();
        },
        onError: () => {
          createNotification.error({
            title: "Error",
            description: "No se pudo actualizar el envío",
          });
        },
      },
    );
  };

  return (
    <Modal
      title={
        <div className="text-center text-lg font-semibold">Editar Envío</div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      destroyOnHidden
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* TYPE (solo lectura) */}
        <Form.Item name="type" label="Tipo">
          <Select
            disabled
            options={[
              { label: "Terrestre", value: "land" },
              { label: "Marítimo", value: "sea" },
            ]}
          />
        </Form.Item>

        {/* CLIENT (solo lectura) */}
        <Form.Item name="clientMaskUuid" label="Cliente">
          <Select
            disabled
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
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              <div className="text-center font-medium mb-2">Productos</div>

              <div className="flex flex-col gap-2">
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
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
                          ];

                          if (allowedKeys.includes(e.key)) return;

                          if (
                            (e.ctrlKey || e.metaKey) &&
                            ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                          ) {
                            return;
                          }

                          if (!/^[0-9]$/.test(e.key)) {
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
