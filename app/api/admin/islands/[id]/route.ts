import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("islands")
    .update({
      title: body.title,
      slug: body.slug ?? null,
      subtitle: body.subtitle ?? null,
      display_order: body.display_order ?? 0,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("islands", "default");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from("islands").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidateTag("islands", "default");
  return NextResponse.json({ success: true });
}
