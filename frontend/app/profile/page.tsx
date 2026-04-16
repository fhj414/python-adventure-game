import { DeploymentNotice } from "@/components/deployment-notice";
import { ProfileClient } from "@/components/profile-client";
import { api, getApiBase, hasConfiguredApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  try {
    const data = await api.profile();
    return <ProfileClient data={data} />;
  } catch {
    return (
      <DeploymentNotice
        title="个人中心还没准备好"
        message={
          hasConfiguredApiBase()
            ? "前端能拿到 API 地址，但当前个人数据接口没有响应。通常先看后端部署、数据库路径和初始化脚本。"
            : "前端还没有配置后端地址，服务端渲染拿不到个人中心数据。"
        }
        apiBase={getApiBase()}
      />
    );
  }
}
