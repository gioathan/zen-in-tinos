"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import IslandForm from "../_components/IslandForm";
import { useEffect, useState } from "react";

export default function EditIsland() {
  const params = useParams();
  const router = useRouter();
  const [island, setIsland] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIsland() {
      const { data, error } = await supabaseClient
        .from("islands")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        message.error("Failed to load island");
        router.push("/admin/islands");
        return;
      }

      setIsland(data);
      setLoading(false);
    }
    fetchIsland();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/islands/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update island");
    message.success("Island updated successfully");
    router.push("/admin/islands");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Island</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <IslandForm initialValues={island} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
