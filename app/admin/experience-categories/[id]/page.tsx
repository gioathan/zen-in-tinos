"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import CategoryForm from "../_components/CategoryForm";
import { useEffect, useState } from "react";

export default function EditExperienceCategory() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      const { data, error } = await supabaseClient
        .from("experience_categories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        message.error("Failed to load category");
        router.push("/admin/experience-categories");
      } else {
        setCategory(data);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/experience-categories/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update category");
    message.success("Category updated successfully");
    router.push("/admin/experience-categories");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Category</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <CategoryForm initialValues={category} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
