"use client";

import { AlertTriangle, ExternalLink, ServerCog } from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, PrimaryButton, SecondaryButton, Shell } from "@/components/ui";

export function DeploymentNotice({
  title,
  message,
  apiBase,
}: {
  title: string;
  message: string;
  apiBase: string;
}) {
  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">部署检查</p>
        <h1 className="mt-2 text-2xl font-black">{title}</h1>
      </section>

      <GlassCard className="border-amber-300/20 bg-gradient-to-br from-amber-400/10 via-white/5 to-red-400/10">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-amber-300/15 p-3 text-amber-200">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">前端已启动，但后端还没接通</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">{message}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3 text-accent">
            <ServerCog size={20} />
          </div>
          <div>
            <h3 className="font-semibold">当前前端请求的 API 地址</h3>
            <p className="mt-1 break-all text-sm text-white/65">{apiBase}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm leading-6 text-white/72">
          <p>1. 在前端项目里配置 `NEXT_PUBLIC_API_BASE_URL` 为真实后端域名。</p>
          <p>2. 后端建议部署到 Render 或 Railway，不建议直接放在 Vercel Serverless 上跑 SQLite + FastAPI 这套结构。</p>
          <p>3. 后端连通后，再回到当前页面刷新即可。</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <PrimaryButton href="/coach">先看 AI 教练页</PrimaryButton>
          <SecondaryButton href="https://render.com/" className="gap-2">
            Render
            <ExternalLink size={14} />
          </SecondaryButton>
        </div>
      </GlassCard>

      <BottomNav />
    </Shell>
  );
}
