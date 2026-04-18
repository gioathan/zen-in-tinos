import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createAdminClient();

  const { data: house, error: houseError } = await supabase
    .from("houses")
    .insert([{
      title: body.title,
      slug: body.slug,
      description: body.description,
      short_description: body.short_description,
      capacity: body.capacity,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      size_sqm: body.size_sqm,
      price_per_night: body.price_per_night,
      price_notes: body.price_notes,
      location_area: body.location_area,
      location_address: body.location_address,
      google_maps_url: body.google_maps_url,
      featured_image_url: body.featured_image_url,
      is_featured: body.is_featured ?? false,
      is_published: body.is_published ?? false,
      display_order: body.display_order ?? 0,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    }])
    .select()
    .single();

  if (houseError) return NextResponse.json({ error: houseError.message }, { status: 400 });

  if (body.gallery_images?.length > 0) {
    await supabase.from("house_images").insert(
      body.gallery_images.map((url: string, index: number) => ({
        house_id: house.id,
        image_url: url,
        display_order: index,
      }))
    );
  }

  if (body.amenity_ids?.length > 0) {
    await supabase.from("house_amenities").insert(
      body.amenity_ids.map((amenityId: string) => ({
        house_id: house.id,
        amenity_id: amenityId,
      }))
    );
  }

  revalidateTag("houses", "default");
  return NextResponse.json(house);
}
