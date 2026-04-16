import { DeploymentNotice } from "@/components/deployment-notice";
import { LevelsClient } from "@/components/levels-client";
import { api, getApiBase, hasConfiguredApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LevelsPage() {
  try {
    const data = await api.bootstrap();
    return <LevelsClient data={data} />;
  } catch {
    return (
      <DeploymentNotice
        title="关卡地图还没接上后端"
        message={
          hasConfiguredApiBase()
            ? "前端已经知道后端地址，但请求关卡数据时失败了。优先看后端是否在正常运行，再检查跨域和数据库初始化。"
            : "当前没有配置 `NEXT_PUBLIC_API_BASE_URL`，所以线上环境拿不到关卡数据。"
        }
        apiBase={getApiBase()}
      />
    );
  }
}
