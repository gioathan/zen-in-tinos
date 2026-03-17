"use client";

import { Card, Form, Input, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export default function SiteSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabaseClient
          .from("site_settings")
          .select("*")
          .order("key", { ascending: true });

        if (error) throw error;

        // Convert array to object for form
        const settingsObject: any = {};
        data?.forEach((setting) => {
          settingsObject[setting.key] = setting.value;
        });

        form.setFieldsValue(settingsObject);
      } catch (error) {
        message.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [form]);

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      // Update each setting
      const updates = Object.entries(values).map(([key, value]) =>
        supabaseClient
          .from("site_settings")
          .update({ value: value as string })
          .eq("key", key)
      );

      await Promise.all(updates);

      message.success("Settings saved successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Site Settings</h1>

      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a", maxWidth: 800 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <h3 style={{ color: "#ededed", marginTop: 0 }}>General</h3>
          
          <Form.Item
            label="Site Name"
            name="site_name"
            extra="The name of your website"
          >
            <Input
              placeholder="Zen in Tinos"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item
            label="Site Tagline"
            name="site_tagline"
            extra="Short description or slogan"
          >
            <Input
              placeholder="Discover Your Perfect Getaway in Tinos"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item
            label="About Text"
            name="about_text"
            extra="Brief about section text"
          >
            <Input.TextArea
              rows={3}
              placeholder="We offer carefully selected holiday homes..."
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <h3 style={{ color: "#ededed", marginTop: 32 }}>Contact Information</h3>

          <Form.Item
            label="Contact Email"
            name="contact_email"
          >
            <Input
              type="email"
              placeholder="info@tinosholidays.com"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item
            label="Contact Phone"
            name="contact_phone"
          >
            <Input
              placeholder="+30 123 456 7890"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item
            label="WhatsApp Number"
            name="whatsapp_number"
            extra="Include country code, e.g., +30 123 456 7890"
          >
            <Input
              placeholder="+30 123 456 7890"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <h3 style={{ color: "#ededed", marginTop: 32 }}>Social Media</h3>

          <Form.Item
            label="Instagram URL"
            name="instagram_url"
          >
            <Input
              placeholder="https://instagram.com/tinosrentals"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item
            label="Facebook URL"
            name="facebook_url"
          >
            <Input
              placeholder="https://facebook.com/tinosrentals"
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <h3 style={{ color: "#ededed", marginTop: 32 }}>Location</h3>

          <Form.Item
            label="Google Maps Embed URL"
            name="google_maps_embed"
            extra="Full embed URL from Google Maps (for office/contact location)"
          >
            <Input
              placeholder="https://www.google.com/maps/embed?pb=..."
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <h3 style={{ color: "#ededed", marginTop: 32 }}>Footer</h3>

          <Form.Item
            label="Footer Text"
            name="footer_text"
            extra="Copyright notice or footer text"
          >
            <Input
              placeholder="© 2026 Zen in Tinos. All rights reserved."
              style={{ background: "#1a1a1a", borderColor: "#3a3a3a", color: "#ededed" }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}