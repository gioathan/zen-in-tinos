import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  const { error: houseError } = await supabase
    .from("houses")
    .update({
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
      island_id: body.island_id ?? null,
    })
    .eq("id", id);

  if (houseError) return NextResponse.json({ error: houseError.message }, { status: 400 });

  // Replace gallery images
  await supabase.from("house_images").delete().eq("house_id", id);
  if (body.gallery_images?.length > 0) {
    await supabase.from("house_images").insert(
      body.gallery_images.map((url: string, index: number) => ({
        house_id: id,
        image_url: url,
        display_order: index,
      }))
    );
  }

  // Replace amenities
  await supabase.from("house_amenities").delete().eq("house_id", id);
  if (body.amenity_ids?.length > 0) {
    await supabase.from("house_amenities").insert(
      body.amenity_ids.map((amenityId: string) => ({
        house_id: id,
        amenity_id: amenityId,
      }))
    );
  }

  revalidateTag("houses", "default");
  return NextResponse.json({ success: true });
}
