"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import ServiceForm from "../_components/ServiceForm";
import { useEffect, useState } from "react";

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      const { data, error } = await supabaseClient
        .from("services")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        message.error('Failed to load service');
        router.push('/admin/services');
      } else {
        setService(data);
      }
      setLoading(false);
    }

    fetchService();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    try {
      const { error } = await supabaseClient
        .from("services")
        .update({
          title: values.title,
          description: values.description,
          icon: values.icon,
          image_url: values.image_url,
          display_order: values.display_order || 0,
          is_active: values.is_active !== false,
        })
        .eq("id", params.id);

      if (error) throw error;

      message.success('Service updated successfully');
      router.push('/admin/services');
    } catch (error: any) {
      message.error(error.message || 'Failed to update service');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Service</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ServiceForm initialValues={service} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}