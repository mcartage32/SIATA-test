import { Table } from "antd";
import type { TableProps } from "antd";

interface Props<T> extends Omit<TableProps<T>, "title"> {
  loading?: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  title?: React.ReactNode;
  extra?: React.ReactNode;
}

export function TableCustom<T extends object>({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
  title,
  extra,
  ...rest
}: Props<T>) {
  return (
    <div className="w-full px-2 md:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
        {(title || extra) && (
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:items-center mb-6">
            {/* Espacio izquierdo solo en desktop */}
            <div className="hidden md:block" />

            {/* Título */}
            <div className="flex justify-center order-1 md:order-none">
              {title && (
                <h2 className="text-xl md:text-2xl font-semibold text-center break-words">
                  {title}
                </h2>
              )}
            </div>

            {/* Botón / extra */}
            <div className="flex justify-end order-2 md:order-none">
              {extra}
            </div>
          </div>
        )}

        <Table
          {...rest}
          dataSource={data}
          loading={loading}
          rowKey="mask_uuid"
          className="w-full"
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            responsive: false,
            showLessItems: false,
            className: "flex flex-wrap gap-2 justify-end",
          }}
          scroll={{
            y: "calc(100vh - 300px)",
            x: "max-content",
          }}
        />
      </div>
    </div>
  );
}
