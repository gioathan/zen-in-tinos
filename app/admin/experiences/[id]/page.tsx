"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import ExperienceForm from "../_components/ExperienceForm";
import { useEffect, useState } from "react";

export default function EditExperience() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      const { data, error } = await supabaseClient
        .from("experiences")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        message.error("Failed to load experience");
        router.push("/admin/experiences");
      } else {
        setExperience(data);
      }
      setLoading(false);
    }
    fetchExperience();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/experiences/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update experience");
    message.success("Experience updated successfully");
    router.push("/admin/experiences");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Experience</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ExperienceForm initialValues={experience} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
