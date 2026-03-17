"use client";

import { Table, Space, Button, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function HousesList() {
  const router = useRouter();
  const { tableProps } = useTable({
    resource: "houses",
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
        <h1 style={{ margin: 0, color: "#ededed" }}>Houses</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/houses/new")}
        >
          Add New House
        </Button>
      </div>

      <Table
        {...tableProps}
        rowKey="id"
        style={{ background: "#1a1a1a" }}
      >
        <Table.Column
          title="Image"
          dataIndex="featured_image_url"
          width={100}
          render={(value) => (
            value ? (
              <Image
                src={value}
                alt="House"
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
              <div style={{ fontSize: "12px", color: "#888" }}>
                {record.location_area || "No location"}
              </div>
            </div>
          )}
        />

        <Table.Column
          title="Details"
          render={(_, record: any) => (
            <div style={{ fontSize: "12px", color: "#888" }}>
              {record.bedrooms} bed · {record.bathrooms} bath · {record.capacity} guests
            </div>
          )}
        />

        <Table.Column
          title="Status"
          dataIndex="is_published"
          width={120}
          render={(value) => (
            <Tag color={value ? "green" : "orange"}>
              {value ? "Published" : "Draft"}
            </Tag>
          )}
        />

        <Table.Column
          title="Featured"
          dataIndex="is_featured"
          width={100}
          render={(value) => (
            value ? <Tag color="blue">Featured</Tag> : <Tag>Regular</Tag>
          )}
        />

        <Table.Column
          title="Actions"
          width={150}
          render={(_, record: any) => (
            <Space>
              <Link href={`/houses/${record.slug}`} target="_blank">
                <Button size="small" icon={<EyeOutlined />} />
              </Link>
              <EditButton size="small" recordItemId={record.id} />
              <DeleteButton size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
}