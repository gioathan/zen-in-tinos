import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export const revalidate = 86400;

export async function GET() {
  const supabase = await createClient();
  
  const { data } = await supabaseClient.from("site_settings").select("*");
  
  const settingsObj: any = {};
  data?.forEach((setting) => {
    settingsObj[setting.key] = setting.value;
  });
  
  return NextResponse.json(settingsObj);
}