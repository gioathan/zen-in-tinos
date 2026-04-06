"use client";

import { Table, Space, Button, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function ExperienceCategoriesList() {
  const router = useRouter();

  const { tableProps } = useTable({
    resource: "experience_categories",
    sorters: {
      initial: [{ field: "display_order", order: "asc" }],
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
        <h1 style={{ margin: 0, color: "#ededed" }}>Experience Categories</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/experience-categories/new")}
        >
          Add Category
        </Button>
      </div>

      <Table {...tableProps} rowKey="id" style={{ background: "#1a1a1a" }}>
        <Table.Column
          title="Label"
          dataIndex="label"
          render={(value) => (
            <div style={{ fontWeight: 600, color: "#ededed" }}>{value}</div>
          )}
        />

        <Table.Column
          title="Order"
          dataIndex="display_order"
          width={100}
          render={(value) => <Tag color="blue">{value ?? 0}</Tag>}
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
