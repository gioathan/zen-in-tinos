"use client";

import { Card, message } from "antd";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import HouseForm from "../_components/HouseForm";

export default function CreateHouse() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      // Insert house
      const { data: house, error: houseError } = await supabaseClient
        .from("houses")
        .insert([{
          title: values.title,
          slug: values.slug,
          description: values.description,
          short_description: values.short_description,
          capacity: values.capacity,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          size_sqm: values.size_sqm,
          price_per_night: values.price_per_night,
          price_notes: values.price_notes,
          location_area: values.location_area,
          location_address: values.location_address,
          google_maps_url: values.google_maps_url,
          featured_image_url: values.featured_image_url,
          is_featured: values.is_featured || false,
          is_published: values.is_published || false,
          display_order: values.display_order || 0,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
        }])
        .select()
        .single();

      if (houseError) throw houseError;

      // Insert gallery images
      if (values.gallery_images && values.gallery_images.length > 0) {
        const imageRecords = values.gallery_images.map((url: string, index: number) => ({
          house_id: house.id,
          image_url: url,
          display_order: index,
        }));

        await supabaseClient
          .from("house_images")
          .insert(imageRecords);
      }

      // Insert amenities
      if (values.amenity_ids && values.amenity_ids.length > 0) {
        const amenityRecords = values.amenity_ids.map((amenityId: string) => ({
          house_id: house.id,
          amenity_id: amenityId,
        }));

        await supabaseClient
          .from("house_amenities")
          .insert(amenityRecords);
      }

      message.success('House created successfully');
      router.push('/admin/houses');
    } catch (error: any) {
      message.error(error.message || 'Failed to create house');
    }
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