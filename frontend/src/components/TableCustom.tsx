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
    <div className="w-full px-4 md:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
        {(title || extra) && (
          <div className="grid grid-cols-3 items-center mb-6">
            <div />
            <div className="flex justify-center">
              {title && (
                <h2 className="text-xl md:text-2xl font-semibold text-center break-words">
                  {title}
                </h2>
              )}
            </div>
            <div className="flex justify-end">{extra}</div>
          </div>
        )}
        <Table
          {...rest}
          dataSource={data}
          loading={loading}
          rowKey="mask_uuid"
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: onPageChange,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
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
