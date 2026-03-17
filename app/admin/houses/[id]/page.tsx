"use client";

import { Card, message, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import HouseForm from "../_components/HouseForm";
import { useEffect, useState } from "react";

export default function EditHouse() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouse() {
      const { data, error } = await supabaseClient
        .from("houses")
        .select(`
          *,
          house_images (id, image_url, display_order),
          house_amenities (amenity_id)
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        message.error('Failed to load house');
        router.push('/admin/houses');
      } else {
        setHouse({
          ...data,
          amenity_ids: data.house_amenities?.map((ha: any) => ha.amenity_id) || [],
        });
      }
      setLoading(false);
    }

    fetchHouse();
  }, [params.id, router]);

  const handleSubmit = async (values: any) => {
    try {
      // Update house
      const { error: houseError } = await supabaseClient
        .from("houses")
        .update({
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
        })
        .eq("id", params.id);

      if (houseError) throw houseError;

      // Delete old gallery images
      await supabaseClient
        .from("house_images")
        .delete()
        .eq("house_id", params.id);

      // Insert new gallery images
      if (values.gallery_images && values.gallery_images.length > 0) {
        const imageRecords = values.gallery_images.map((url: string, index: number) => ({
          house_id: params.id,
          image_url: url,
          display_order: index,
        }));

        await supabaseClient
          .from("house_images")
          .insert(imageRecords);
      }

      // Delete old amenities
      await supabaseClient
        .from("house_amenities")
        .delete()
        .eq("house_id", params.id);

      // Insert new amenities
      if (values.amenity_ids && values.amenity_ids.length > 0) {
        const amenityRecords = values.amenity_ids.map((amenityId: string) => ({
          house_id: params.id,
          amenity_id: amenityId,
        }));

        await supabaseClient
          .from("house_amenities")
          .insert(amenityRecords);
      }

      message.success('House updated successfully');
      router.push('/admin/houses');
    } catch (error: any) {
      message.error(error.message || 'Failed to update house');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: "#ededed" }}>Edit House</h1>
      <Card style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}>
        <HouseForm initialValues={house} onSubmit={handleSubmit} isEdit />
      </Card>
    </div>
  );
}