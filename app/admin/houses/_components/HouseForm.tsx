"use client";

import { Form, Input, InputNumber, Switch, Button, Select, Space, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import Image from "next/image";

interface HouseFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isEdit?: boolean;
}

export default function HouseForm({ initialValues, onSubmit, isEdit = false }: HouseFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [islands, setIslands] = useState<any[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    initialValues?.featured_image_url || null
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialValues?.house_images?.map((img: any) => img.image_url) || []
  );
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    async function fetchAmenities() {
      const { data } = await supabaseClient
        .from("amenities")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setAmenities(data);
    }

    async function fetchIslands() {
      const { data } = await supabaseClient
        .from("islands")
        .select("id, title")
        .order("title", { ascending: true });
      if (data) setIslands(data);
    }

    fetchAmenities();
    fetchIslands();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    form.setFieldValue('slug', slug);
  };

  // Upload featured image
  const handleFeaturedUpload = async (file: File) => {
    setUploadingFeatured(true);
    try {
      // Delete old image if exists
      if (featuredImageUrl) {
        await deleteImage(featuredImageUrl);
      }

      const url = await uploadImage(file, "houses/featured");
      if (url) {
        setFeaturedImageUrl(url);
        form.setFieldValue('featured_image_url', url);
        message.success('Image uploaded successfully');
      } else {
        message.error('Upload failed');
      }
    } catch (error) {
      message.error('Upload error');
    } finally {
      setUploadingFeatured(false);
    }
    return false; // Prevent default upload behavior
  };

  // Upload gallery image
  const handleGalleryUpload = async (file: File) => {
    setUploadingGallery(true);
    try {
      const url = await uploadImage(file, "houses/gallery");
      if (url) {
        setGalleryImages([...galleryImages, url]);
        message.success('Image uploaded successfully');
      } else {
        message.error('Upload failed');
      }
    } catch (error) {
      message.error('Upload error');
    } finally {
      setUploadingGallery(false);
    }
    return false;
  };

  // Remove gallery image
  const handleRemoveGalleryImage = async (url: string) => {
    await deleteImage(url);
    setGalleryImages(galleryImages.filter(img => img !== url));
    message.success('Image removed');
  };

  const handleSubmit = async (values: any) => {
    if (!featuredImageUrl) {
      message.error('Please upload a featured image');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...values,
        featured_image_url: featuredImageUrl,
        gallery_images: galleryImages,
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
        rules={[{ required: true, message: 'Please enter house title' }]}
      >
        <Input 
          placeholder="Beautiful Villa in Tinos"
          onChange={handleTitleChange}
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Slug (URL)"
        name="slug"
        rules={[{ required: true, message: 'Please enter URL slug' }]}
        extra="Auto-generated from title, edit if needed"
      >
        <Input 
          placeholder="beautiful-villa-in-tinos"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Short Description"
        name="short_description"
        extra="Brief description for cards (1-2 sentences)"
      >
        <Input.TextArea 
          rows={2}
          placeholder="A stunning villa with sea views..."
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Full Description"
        name="description"
      >
        <Input.TextArea 
          rows={6}
          placeholder="Detailed description of the property..."
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Space size="large" style={{ width: '100%', marginBottom: 16 }}>
        <Form.Item
          label="Capacity (Guests)"
          name="capacity"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber 
            min={1} 
            placeholder="4"
            style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
          />
        </Form.Item>

        <Form.Item
          label="Bedrooms"
          name="bedrooms"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber 
            min={1} 
            placeholder="2"
            style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
          />
        </Form.Item>

        <Form.Item
          label="Bathrooms"
          name="bathrooms"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber 
            min={1} 
            placeholder="2"
            style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
          />
        </Form.Item>

        <Form.Item
          label="Size (m²)"
          name="size_sqm"
        >
          <InputNumber 
            min={1} 
            placeholder="120"
            style={{ width: 120, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
          />
        </Form.Item>
      </Space>

      <Form.Item
        label="Price per Night (€)"
        name="price_per_night"
      >
        <InputNumber 
          min={0} 
          placeholder="150"
          style={{ width: 200, background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Price Notes"
        name="price_notes"
        extra="e.g., 'Prices vary by season'"
      >
        <Input 
          placeholder="Contact for seasonal pricing"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Location Area"
        name="location_area"
        extra="e.g., 'Chora', 'Pyrgos', 'Isternia'"
      >
        <Input 
          placeholder="Chora"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Full Address"
        name="location_address"
      >
        <Input 
          placeholder="Full address"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Google Maps URL"
        name="google_maps_url"
        extra="Full Google Maps link"
      >
        <Input 
          placeholder="https://maps.google.com/..."
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="Amenities"
        name="amenity_ids"
      >
        <Select
          mode="multiple"
          placeholder="Select amenities"
          options={amenities.map(a => ({ label: a.name, value: a.id }))}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="Island" name="island_id">
        <Select
          placeholder="Select island (optional)"
          allowClear
          options={islands.map(i => ({ label: i.title, value: i.id }))}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="Featured Image" required>
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={handleFeaturedUpload}
          accept="image/*"
        >
          {featuredImageUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={featuredImageUrl}
                alt="Featured"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>
                {uploadingFeatured ? 'Uploading...' : 'Upload'}
              </div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item label="Gallery Images">
        <Space wrap>
          {galleryImages.map((url, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <Image
                src={url}
                alt={`Gallery ${index + 1}`}
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{ position: 'absolute', top: 4, right: 4 }}
                onClick={() => handleRemoveGalleryImage(url)}
              />
            </div>
          ))}
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={handleGalleryUpload}
            accept="image/*"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>
                {uploadingGallery ? 'Uploading...' : 'Add'}
              </div>
            </div>
          </Upload>
        </Space>
      </Form.Item>

      <Space size="large">
        <Form.Item name="is_published" valuePropName="checked" label="Published">
          <Switch />
        </Form.Item>

        <Form.Item name="is_featured" valuePropName="checked" label="Featured">
          <Switch />
        </Form.Item>
      </Space>

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

      <Form.Item
        label="SEO Title"
        name="meta_title"
        extra="Leave empty to use house title"
      >
        <Input 
          placeholder="Custom SEO title"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item
        label="SEO Description"
        name="meta_description"
      >
        <Input.TextArea 
          rows={3}
          placeholder="Description for search engines (150-160 characters)"
          style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? 'Update House' : 'Create House'}
          </Button>
          <Button href="/admin/houses" size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}