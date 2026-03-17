"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import ServiceForm from "../_components/ServiceForm";

export default function CreateService() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const { error } = await supabaseClient
        .from("services")
        .insert([{
          title: values.title,
          description: values.description,
          icon: values.icon,
          image_url: values.image_url,
          display_order: values.display_order || 0,
          is_active: values.is_active !== false,
        }]);

      if (error) throw error;

      message.success('Service created successfully');
      router.push('/admin/services');
    } catch (error: any) {
      message.error(error.message || 'Failed to create service');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Create New Service</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ServiceForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}