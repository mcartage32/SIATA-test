import { useEffect, type ReactNode } from "react";
import { notification, type NotificationArgsProps } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

// Referencia global al API de notificaciones
let notificationRef: NotificationInstance | null = null;

// eslint-disable-next-line react-refresh/only-export-components
export const createNotification = {
  success: (args: Omit<NotificationArgsProps, "type">) => {
    notificationRef?.success({
      ...args,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  error: (args: Omit<NotificationArgsProps, "type">) => {
    notificationRef?.error({
      ...args,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  info: (args: Omit<NotificationArgsProps, "type">) => {
    notificationRef?.info({
      ...args,
      showProgress: true,
      pauseOnHover: true,
    });
  },
  warning: (args: Omit<NotificationArgsProps, "type">) => {
    notificationRef?.warning({
      ...args,
      showProgress: true,
      pauseOnHover: true,
    });
  },
};

// Proveedor de contexto que inyecta el `contextHolder` de Ant Design
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  // Guardar la instancia de notificaciones para uso global
  useEffect(() => {
    notificationRef = api;
  }, [api]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};
