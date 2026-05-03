import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const supabase = await createClient();

  const { data: houses } = await supabase
    .from("houses")
    .select("slug, updated_at")
    .eq("is_published", true);

  return (houses ?? []).map((house) => ({
    url: `${baseUrl}/houses/${house.slug}`,
    lastModified: house.updated_at ? new Date(house.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));
}
