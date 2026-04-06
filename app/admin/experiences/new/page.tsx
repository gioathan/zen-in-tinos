"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminFetch";
import ExperienceForm from "../_components/ExperienceForm";

export default function CreateExperience() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await adminFetch("/api/admin/experiences", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create experience");
    message.success("Experience created successfully");
    router.push("/admin/experiences");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Create New Experience</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <ExperienceForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
