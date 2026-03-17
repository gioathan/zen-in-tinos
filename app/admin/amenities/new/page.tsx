"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import AmenityForm from "../_components/AmenityForm";

export default function CreateAmenity() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const { error } = await supabaseClient
        .from("amenities")
        .insert([{
          name: values.name,
          icon: values.icon,
          category: values.category,
          display_order: values.display_order || 0,
        }]);

      if (error) throw error;

      message.success('Amenity created successfully');
      router.push('/admin/amenities');
    } catch (error: any) {
      message.error(error.message || 'Failed to create amenity');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Create New Amenity</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a", maxWidth: 600 }}>
        <AmenityForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}