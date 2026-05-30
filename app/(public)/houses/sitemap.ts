import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const supabase = await createClient();

  const { data: houses } = await supabase
    .from("houses")
    .select("slug, updated_at, islands(slug)")
    .eq("is_published", true);

  return (houses ?? []).map((house: any) => {
    const islandSlug = house.islands?.slug;
    const url = islandSlug
      ? `${baseUrl}/${islandSlug}/${house.slug}`
      : `${baseUrl}/houses/${house.slug}`;
    return {
      url,
      lastModified: house.updated_at ? new Date(house.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    };
  });
}
