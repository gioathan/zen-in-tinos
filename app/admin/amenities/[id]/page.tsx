"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import AmenityForm from "../_components/AmenityForm";
import { useEffect, useState } from "react";

export default function EditAmenity() {
  const params = useParams();
  const router = useRouter();
  const [amenity, setAmenity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmenity() {
      const { data, error } = await supabaseClient
        .from("amenities")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        message.error('Failed to load amenity');
        router.push('/admin/amenities');
      } else {
        setAmenity(data);
      }
      setLoading(false);
    }

    fetchAmenity();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    try {
      const { error } = await supabaseClient
        .from("amenities")
        .update({
          name: values.name,
          icon: values.icon,
          category: values.category,
          display_order: values.display_order || 0,
        })
        .eq("id", params.id);

      if (error) throw error;

      message.success('Amenity updated successfully');
      router.push('/admin/amenities');
    } catch (error: any) {
      message.error(error.message || 'Failed to update amenity');
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
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit Amenity</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a", maxWidth: 600 }}>
        <AmenityForm initialValues={amenity} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}