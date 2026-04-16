import { DeploymentNotice } from "@/components/deployment-notice";
import { HomeClient } from "@/components/home-client";
import { api, getApiBase, hasConfiguredApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const data = await api.bootstrap();
    return <HomeClient data={data} />;
  } catch {
    return (
      <DeploymentNotice
        title="首页暂时拿不到学习数据"
        message={
          hasConfiguredApiBase()
            ? "前端已经配置了 API 地址，但当前还连不到后端服务。请先确认后端是否成功部署，并检查后端日志。"
            : "前端还没有配置后端地址，所以服务端渲染时会默认请求 localhost。在线上环境里，这个地址不可用。"
        }
        apiBase={getApiBase()}
      />
    );
  }
}
