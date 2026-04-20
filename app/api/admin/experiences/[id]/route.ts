import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  let imageId: string | null | undefined = undefined;
  if (body.image_url !== undefined) {
    const { data: current } = await supabase
      .from("experiences")
      .select("image_id, image_url")
      .eq("id", id)
      .single();

    if (body.image_url !== current?.image_url) {
      if (current?.image_id) {
        await supabase.from("images").delete().eq("id", current.image_id);
      }
      if (body.image_url) {
        const { data: img } = await supabase
          .from("images")
          .insert([{ url: body.image_url, alt_text: body.title ?? null }])
          .select("id")
          .single();
        imageId = img?.id ?? null;
      } else {
        imageId = null;
      }
    } else {
      imageId = current?.image_id ?? null;
    }
  }

  const updatePayload: Record<string, unknown> = {
    title: body.title,
    category_id: body.category_id,
    description: body.description,
    image_url: body.image_url,
    display_order: body.display_order ?? 0,
    is_active: body.is_active !== false,
  };
  if (imageId !== undefined) updatePayload.image_id = imageId;

  const { error } = await supabase
    .from("experiences")
    .update(updatePayload)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("experiences", "default");
  return NextResponse.json({ success: true });
}
