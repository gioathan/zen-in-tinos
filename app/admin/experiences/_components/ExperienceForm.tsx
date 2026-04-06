"use client";

import { Form, Input, InputNumber, Switch, Button, Space, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import { supabaseClient } from "@/lib/supabase";
import Image from "next/image";

interface ExperienceFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export default function ExperienceForm({ initialValues, onSubmit, isEdit = false }: ExperienceFormProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialValues?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    supabaseClient
      .from("experience_categories")
      .select("id, label")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setCategories(data.map((c) => ({ value: c.id, label: c.label })));
        }
      });
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      if (imageUrl) await deleteImage(imageUrl);
      const url = await uploadImage(file, "experiences");
      if (url) {
        setImageUrl(url);
        form.setFieldValue("image_url", url);
        message.success("Image uploaded successfully");
      } else {
        message.error("Upload failed");
      }
    } catch {
      message.error("Upload error");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit({ ...values, image_url: imageUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ is_active: true, display_order: 0, ...initialValues }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter a title" }]}
      >
        <Input
          placeholder="Sunset dinner at a cliff-top taverna"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category_id"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          placeholder="Select category"
          options={categories}
          loading={categories.length === 0}
          style={{ background: "#1a1a1a" }}
        />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea
          rows={4}
          placeholder="Describe the experience..."
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item label="Image">
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleImageUpload}
          accept="image/*"
        >
          {imageUrl ? (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={imageUrl} alt="Experience" fill style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{uploading ? "Uploading..." : "Upload"}</div>
            </div>
          )}
        </Upload>
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

      <Form.Item name="is_active" valuePropName="checked" label="Active">
        <Switch defaultChecked />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? "Update Experience" : "Create Experience"}
          </Button>
          <Button onClick={() => router.push("/admin/experiences")} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
