import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

const TTL = 3600;

export const getFeaturedHouses = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("houses")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(3);
    return data ?? [];
  },
  ["featured-houses"],
  { revalidate: TTL, tags: ["houses"] }
);

export const getPublishedHouses = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("houses")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    return data ?? [];
  },
  ["published-houses"],
  { revalidate: TTL, tags: ["houses"] }
);

export const getHouseBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await createPublicClient()
      .from("houses")
      .select(`
        *,
        house_images (id, image_url, alt_text, display_order),
        house_amenities (amenity_id, amenities (id, name, icon, category)),
        islands (id, title, slug)
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data ?? null;
  },
  ["house-by-slug"],
  { revalidate: TTL, tags: ["houses"] }
);

export const getIslandsWithPreview = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [{ data: islands }, { data: houses }] = await Promise.all([
      supabase
        .from("islands")
        .select("id, title, subtitle, slug")
        .not("slug", "is", null)
        .order("display_order", { ascending: true }),
      supabase
        .from("houses")
        .select("id, title, slug, featured_image_url, short_description, bedrooms, bathrooms, price_per_night, display_order, island_id")
        .eq("is_published", true)
        .order("display_order", { ascending: true }),
    ]);
    return (islands ?? []).map((island: any) => ({
      ...island,
      previewHouse: (houses ?? []).find((h: any) => h.island_id === island.id) ?? null,
      houseCount: (houses ?? []).filter((h: any) => h.island_id === island.id).length,
    }));
  },
  ["islands-with-preview"],
  { revalidate: TTL, tags: ["islands", "houses"] }
);

export const getIslandBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await createPublicClient()
      .from("islands")
      .select("id, title, subtitle, slug")
      .eq("slug", slug)
      .single();
    return data ?? null;
  },
  ["island-by-slug"],
  { revalidate: TTL, tags: ["islands"] }
);

export const getHousesByIslandId = unstable_cache(
  async (islandId: string) => {
    const { data } = await createPublicClient()
      .from("houses")
      .select("*")
      .eq("island_id", islandId)
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    return data ?? [];
  },
  ["houses-by-island"],
  { revalidate: TTL, tags: ["houses"] }
);

export const getFeaturedServices = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(3);
    return data ?? [];
  },
  ["featured-services"],
  { revalidate: TTL, tags: ["services"] }
);

export const getActiveServices = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    return data ?? [];
  },
  ["active-services"],
  { revalidate: TTL, tags: ["services"] }
);

export const getExperiences = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [{ data: categories }, { data: experiences }] = await Promise.all([
      supabase
        .from("experience_categories")
        .select("id, label")
        .order("display_order", { ascending: true }),
      supabase
        .from("experiences")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);
    return { categories: categories ?? [], experiences: experiences ?? [] };
  },
  ["experiences"],
  { revalidate: TTL, tags: ["experiences"] }
);

export const getSiteSettings = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("site_settings")
      .select("*");
    const settings: Record<string, string> = {};
    data?.forEach((row) => {
      settings[row.key] = row.value;
    });
    return settings;
  },
  ["site-settings"],
  { revalidate: TTL, tags: ["settings"] }
);
