import { LevelPlayClient } from "@/components/level-play-client";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LevelDetailPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const level = await api.level(levelId);
  return <LevelPlayClient level={level} />;
}
