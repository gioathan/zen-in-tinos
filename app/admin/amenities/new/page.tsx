"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import AmenityForm from "../_components/AmenityForm";

export default function CreateAmenity() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/amenities", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create amenity");
    message.success("Amenity created successfully");
    router.push("/admin/amenities");
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
