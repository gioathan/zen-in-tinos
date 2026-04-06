"use client";

import { Form, Input, InputNumber, Button, Space } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export default function CategoryForm({ initialValues, onSubmit, isEdit = false }: CategoryFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      initialValues={{ display_order: 0, ...initialValues }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Label"
        name="label"
        rules={[{ required: true, message: "Please enter a category label" }]}
      >
        <Input
          placeholder="Hidden Beaches"
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
          style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Category" : "Create Category"}
          </Button>
          <Button onClick={() => router.push("/admin/experience-categories")} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
