import { getHouseBySlug } from "@/lib/data/public";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HouseDetailRedirect({ params }: Props) {
  const { slug } = await params;
  const house = await getHouseBySlug(slug);

  if (!house) notFound();

  const island = (house as any).islands;
  if (island?.slug) {
    redirect(`/${island.slug}/${house.slug}`);
  }

  // Fallback: house has no island yet — redirect to houses listing
  redirect("/houses");
}
