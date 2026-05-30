"use client";

import { Form, Input, InputNumber, Button, Space } from "antd";
import { useState } from "react";

interface IslandFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export default function IslandForm({ initialValues, onSubmit, isEdit = false }: IslandFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
    form.setFieldValue("slug", slug);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter island title" }]}
      >
        <Input
          placeholder="Tinos"
          onChange={handleTitleChange}
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Slug (URL)"
        name="slug"
        rules={[{ required: true, message: "Please enter URL slug" }]}
        extra="Auto-generated from title, edit if needed"
      >
        <Input
          placeholder="tinos"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item label="Subtitle" name="subtitle">
        <Input
          placeholder="The marble island of the Cyclades"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Display Order"
        name="display_order"
        extra="Lower numbers appear first"
      >
        <InputNumber
          min={0}
          placeholder="0"
          style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Island" : "Create Island"}
          </Button>
          <Button href="/admin/islands" size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
