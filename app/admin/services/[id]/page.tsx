"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
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
        message.error("Failed to load service");
        router.push("/admin/services");
      } else {
        setService(data);
      }
      setLoading(false);
    }
    fetchService();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/services/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update service");
    message.success("Service updated successfully");
    router.push("/admin/services");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Service</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ServiceForm initialValues={service} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
