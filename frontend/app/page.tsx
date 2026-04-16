import { HomeClient } from "@/components/home-client";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await api.bootstrap();
  return <HomeClient data={data} />;
}
