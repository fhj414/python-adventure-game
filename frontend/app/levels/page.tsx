import { LevelsClient } from "@/components/levels-client";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LevelsPage() {
  const data = await api.bootstrap();
  return <LevelsClient data={data} />;
}
