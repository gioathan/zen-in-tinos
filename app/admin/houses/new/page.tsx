"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import HouseForm from "../_components/HouseForm";

export default function CreateHouse() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/houses", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create house");
    message.success("House created successfully");
    router.push("/admin/houses");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Create New House</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <HouseForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
