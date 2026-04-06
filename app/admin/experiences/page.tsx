"use client";

import { Table, Space, Button, Tag, Switch, message } from "antd";
import { useTable } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabase";

export default function ExperiencesList() {
  const router = useRouter();
  const invalidate = useInvalidate();

  const { tableProps } = useTable({
    resource: "experiences",
    sorters: {
      initial: [{ field: "display_order", order: "asc" }],
    },
    meta: {
      select: "*, experience_categories(label)",
    },
  });

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("experiences")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      message.success("Status updated");
      invalidate({ resource: "experiences", invalidates: ["list"] });
    } catch {
      message.error("Failed to update status");
    }
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Experiences</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/experiences/new")}
        >
          Add New Experience
        </Button>
      </div>

      <Table {...tableProps} rowKey="id" style={{ background: "#1a1a1a" }}>
        <Table.Column
          title="Image"
          dataIndex="image_url"
          width={100}
          render={(value) =>
            value ? (
              <Image
                src={value}
                alt="Experience"
                width={80}
                height={60}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <div style={{ width: 80, height: 60, background: "#2a2a2a", borderRadius: 4 }} />
            )
          }
        />

        <Table.Column
          title="Title"
          dataIndex="title"
          render={(value) => (
            <div style={{ fontWeight: 600, color: "#ededed" }}>{value}</div>
          )}
        />

        <Table.Column
          title="Category"
          dataIndex="experience_categories"
          render={(value) => (
            <Tag color="blue">{value?.label ?? "—"}</Tag>
          )}
        />

        <Table.Column
          title="Description"
          dataIndex="description"
          render={(value) => (
            <div style={{
              color: "#888",
              maxWidth: 280,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {value || "-"}
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
          title="Active"
          dataIndex="is_active"
          width={100}
          render={(value, record: any) => (
            <Switch
              checked={value}
              onChange={() => handleToggleActive(record.id, value)}
            />
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
