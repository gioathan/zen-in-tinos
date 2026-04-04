"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";
import HouseForm from "../_components/HouseForm";
import { useEffect, useState } from "react";

export default function EditHouse() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouse() {
      const { data, error } = await supabaseClient
        .from("houses")
        .select(`
          *,
          house_images (id, image_url, display_order),
          house_amenities (amenity_id)
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        message.error("Failed to load house");
        router.push("/admin/houses");
      } else {
        setHouse({
          ...data,
          amenity_ids: data.house_amenities?.map((ha: any) => ha.amenity_id) || [],
        });
      }
      setLoading(false);
    }
    fetchHouse();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    const res = await adminFetch(`/api/admin/houses/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update house");
    message.success("House updated successfully");
    router.push("/admin/houses");
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit House</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <HouseForm initialValues={house} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}
