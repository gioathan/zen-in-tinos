import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("islands")
    .insert([{
      title: body.title,
      slug: body.slug ?? null,
      subtitle: body.subtitle ?? null,
      display_order: body.display_order ?? 0,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateTag("islands", "default");
  return NextResponse.json(data);
}
