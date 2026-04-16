import { DeploymentNotice } from "@/components/deployment-notice";
import { WrongBookClient } from "@/components/wrong-book-client";
import { api, getApiBase, hasConfiguredApiBase } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function WrongBookPage() {
  try {
    const records = await api.wrongQuestions();
    return <WrongBookClient records={records} />;
  } catch {
    return (
      <DeploymentNotice
        title="错题本还没接上数据"
        message={
          hasConfiguredApiBase()
            ? "前端已经配置后端地址，但当前错题本接口请求失败。先确认后端服务在线，再检查数据库是否已初始化。"
            : "前端还没有配置后端地址，所以错题本在线上环境里暂时不可用。"
        }
        apiBase={getApiBase()}
      />
    );
  }
}
