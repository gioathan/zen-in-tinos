"use client";

import { Table, Space, Button, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function AmenitiesList() {
  const router = useRouter();
  
  const { tableProps } = useTable({
    resource: "amenities",
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
        marginBottom: "24px" 
      }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Amenities</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/amenities/new")}
        >
          Add New Amenity
        </Button>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        style={{ background: "#1a1a1a" }}
      >
        <Table.Column
          title="Name"
          dataIndex="name"
          render={(value) => (
            <div style={{ fontWeight: 600, color: "#ededed" }}>{value}</div>
          )}
        />

        <Table.Column
          title="Icon"
          dataIndex="icon"
          width={150}
          render={(value) => (
            <Tag color="cyan">{value || "No icon"}</Tag>
          )}
        />

        <Table.Column
          title="Category"
          dataIndex="category"
          width={150}
          render={(value) => {
            const colors: any = {
              basic: "blue",
              kitchen: "green",
              outdoor: "orange",
              entertainment: "purple",
            };
            return (
              <Tag color={colors[value] || "default"}>
                {value || "Uncategorized"}
              </Tag>
            );
          }}
        />

        <Table.Column
          title="Display Order"
          dataIndex="display_order"
          width={120}
          render={(value) => (
            <Tag color="blue">{value || 0}</Tag>
          )}
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