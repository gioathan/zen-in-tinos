import { NextResponse } from "next/server";
import { createAdminClient, verifyAuth } from "@/lib/supabase/admin";

export async function PUT(request: Request) {
  const user = await verifyAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createAdminClient();

  const updates = Object.entries(body).map(([key, value]) =>
    supabase.from("site_settings").update({ value: value as string }).eq("key", key)
  );

  await Promise.all(updates);
  return NextResponse.json({ success: true });
}
