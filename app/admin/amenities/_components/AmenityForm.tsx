"use client";

import { Form, Input, InputNumber, Button, Space, Select } from "antd";
import { useState } from "react";

interface AmenityFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

const CATEGORIES = [
  { label: "Basic", value: "basic" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Entertainment", value: "entertainment" },
];

export default function AmenityForm({ initialValues, onSubmit, isEdit = false }: AmenityFormProps) {
  const [form] = Form.useForm();
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
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter amenity name' }]}
      >
        <Input 
          placeholder="WiFi"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Icon Name"
        name="icon"
        extra="Lucide icon name, e.g., 'Wifi', 'Wind', 'Waves', 'Tv'"
      >
        <Input 
          placeholder="Wifi"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
      >
        <Select
          placeholder="Select category"
          options={CATEGORIES}
          style={{ width: '100%' }}
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
            {isEdit ? 'Update Amenity' : 'Create Amenity'}
          </Button>
          <Button href="/admin/amenities" size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}