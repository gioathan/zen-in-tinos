"use client";

import { Form, Input, InputNumber, Switch, Button, Space, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ← Add this import
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import Image from "next/image";

interface ServiceFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export default function ServiceForm({ initialValues, onSubmit, isEdit = false }: ServiceFormProps) {
  const [form] = Form.useForm();
  const router = useRouter(); // ← Add this
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.image_url || null
  );
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Delete old image if exists
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      const url = await uploadImage(file, "services");
      if (url) {
        setImageUrl(url);
        form.setFieldValue('image_url', url);
        message.success('Image uploaded successfully');
      } else {
        message.error('Upload failed');
      }
    } catch (error) {
      message.error('Upload error');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit({
        ...values,
        image_url: imageUrl,
      });
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
        rules={[{ required: true, message: 'Please enter service title' }]}
      >
        <Input 
          placeholder="Airport Transfers"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea 
          rows={4}
          placeholder="Describe the service..."
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Icon Name"
        name="icon"
        extra="Lucide icon name, e.g., 'Car', 'Phone', 'Sparkles'"
      >
        <Input 
          placeholder="Car"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item label="Service Image">
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleImageUpload}
          accept="image/*"
        >
          {imageUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={imageUrl}
                alt="Service"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>
                {uploading ? 'Uploading...' : 'Upload'}
              </div>
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
          placeholder="0"
          style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item name="is_active" valuePropName="checked" label="Active">
        <Switch defaultChecked />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? 'Update Service' : 'Create Service'}
          </Button>
          <Button onClick={() => router.push('/admin/services')} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}