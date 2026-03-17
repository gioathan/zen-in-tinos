"use client";

import { Table, Space, Button, Tag, Switch, message } from "antd";
import { useTable } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabase";

export default function ServicesList() {
  const router = useRouter();
  const invalidate = useInvalidate();
  
  const { tableProps } = useTable({
    resource: "services",
    sorters: {
      initial: [{ field: "display_order", order: "asc" }],
    },
  });

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("services")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      message.success("Status updated");
      
      // Invalidate the services query to refetch
      invalidate({
        resource: "services",
        invalidates: ["list"],
      });
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "24px" 
      }}>
        <h1 style={{ margin: 0, color: "#ededed" }}>Services</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/services/new")}
        >
          Add New Service
        </Button>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        style={{ background: "#1a1a1a" }}
      >
        <Table.Column
          title="Image"
          dataIndex="image_url"
          width={100}
          render={(value) => (
            value ? (
              <Image
                src={value}
                alt="Service"
                width={80}
                height={60}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <div style={{ width: 80, height: 60, background: "#2a2a2a", borderRadius: 4 }} />
            )
          )}
        />
        
        <Table.Column
          title="Title"
          dataIndex="title"
          render={(value, record: any) => (
            <div>
              <div style={{ fontWeight: 600, color: "#ededed" }}>{value}</div>
              {record.icon && (
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Icon: {record.icon}
                </div>
              )}
            </div>
          )}
        />

        <Table.Column
          title="Description"
          dataIndex="description"
          render={(value) => (
            <div style={{ 
              color: "#888", 
              maxWidth: 300, 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" 
            }}>
              {value || "-"}
            </div>
          )}
        />

        <Table.Column
          title="Order"
          dataIndex="display_order"
          width={80}
          render={(value) => (
            <Tag color="blue">{value || 0}</Tag>
          )}
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
              <DeleteButton 
                size="small" 
                recordItemId={record.id}
                onSuccess={() => {
                  console.log('✅ Delete successful');
                }}
              />
            </Space>
          )}
        />
      </Table>
    </div>
  );
}