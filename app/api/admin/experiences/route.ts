import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await createAdminClient()
    .from("experiences")
    .insert([{
      title: body.title,
      category_id: body.category_id,
      description: body.description,
      image_url: body.image_url,
      display_order: body.display_order ?? 0,
      is_active: body.is_active !== false,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("experiences", "default");
  return NextResponse.json(data);
}
