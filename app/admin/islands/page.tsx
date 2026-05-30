"use client";

import { Table, Space, Button, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function IslandsList() {
  const router = useRouter();

  const { tableProps } = useTable({
    resource: "islands",
    sorters: {
      initial: [{ field: "display_order", order: "asc" }],
    },
    meta: {
      select: "*",
    },
  });

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Islands</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/islands/new")}
        >
          Add New Island
        </Button>
      </div>

      <Table {...tableProps} rowKey="id" style={{ background: "#1a1a1a" }}>
        <Table.Column
          title="Title"
          dataIndex="title"
          render={(value) => (
            <div style={{ fontWeight: 600, color: "#ededed" }}>{value}</div>
          )}
        />

        <Table.Column
          title="Subtitle"
          dataIndex="subtitle"
          render={(value) => (
            <div style={{ color: "#888", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value || "—"}
            </div>
          )}
        />

        <Table.Column
          title="Order"
          dataIndex="display_order"
          width={80}
          render={(value) => <Tag color="geekblue">{value ?? 0}</Tag>}
        />

        <Table.Column
          title="Actions"
          width={120}
          render={(_, record: any) => (
            <Space>
              <EditButton size="small" recordItemId={record.id} />
              <DeleteButton size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
