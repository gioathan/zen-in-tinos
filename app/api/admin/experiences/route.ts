import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createAdminClient();

  let imageId: string | null = null;
  if (body.image_url) {
    const { data: img } = await supabase
      .from("images")
      .insert([{ url: body.image_url, alt_text: body.title ?? null }])
      .select("id")
      .single();
    imageId = img?.id ?? null;
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert([{
      title: body.title,
      category_id: body.category_id,
      description: body.description,
      image_url: body.image_url,
      image_id: imageId,
      display_order: body.display_order ?? 0,
      is_active: body.is_active !== false,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("experiences", "default");
  return NextResponse.json(data);
}
