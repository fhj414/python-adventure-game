import { DeploymentNotice } from "@/components/deployment-notice";
import { LevelPlayClient } from "@/components/level-play-client";
import { api, getApiBase, hasConfiguredApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LevelDetailPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  try {
    const level = await api.level(levelId);
    return <LevelPlayClient level={level} />;
  } catch {
    return (
      <DeploymentNotice
        title="关卡详情暂时打不开"
        message={
          hasConfiguredApiBase()
            ? "前端已经配置后端地址，但当前拿不到这一关的数据。请优先确认后端服务和数据库是否已经初始化。"
            : "前端还没配置后端地址，所以线上环境无法加载关卡详情。"
        }
        apiBase={getApiBase()}
      />
    );
  }
}
