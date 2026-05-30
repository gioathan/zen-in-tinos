"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import IslandForm from "../_components/IslandForm";

export default function CreateIsland() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/islands", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create island");
    message.success("Island created successfully");
    router.push("/admin/islands");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Add New Island</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <IslandForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
