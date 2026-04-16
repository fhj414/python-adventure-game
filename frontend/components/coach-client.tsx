"use client";

import { useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, PrimaryButton, Shell } from "@/components/ui";
import { api } from "@/lib/api";

type AIState = {
  loading: boolean;
  result: string;
};

export function CoachClient() {
  const [levelId, setLevelId] = useState("level-05");
  const [userCode, setUserCode] = useState("temp = 31\nprint('Hot')");
  const [result, setResult] = useState<AIState>({ loading: false, result: "在这里向 AI 教练提问，支持未配置 API Key 的 mock 演示。" });

  async function runAction(action: "hint" | "explain" | "locate" | "similar") {
    setResult({ loading: true, result: "AI 教练思考中..." });
    const body = { level_id: levelId, user_code: userCode };
    const response =
      action === "hint"
        ? await api.aiHint(body)
        : action === "explain"
          ? await api.aiExplain(body)
          : action === "locate"
            ? await api.aiLocateError(body)
            : await api.aiSimilar(body);
    setResult({ loading: false, result: JSON.stringify(response.data, null, 2) });
  }

  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">AI 教练</p>
        <h1 className="mt-2 text-2xl font-black">卡住时，马上得到可执行帮助</h1>
      </section>

      <GlassCard className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">关卡 ID</span>
          <input value={levelId} onChange={(event) => setLevelId(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">题目或代码</span>
          <textarea value={userCode} onChange={(event) => setUserCode(event.target.value)} className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => runAction("hint")} className="rounded-2xl bg-white/5 px-3 py-3 text-sm">给我一点提示</button>
          <button onClick={() => runAction("explain")} className="rounded-2xl bg-white/5 px-3 py-3 text-sm">像老师一样讲懂</button>
          <button onClick={() => runAction("locate")} className="rounded-2xl bg-white/5 px-3 py-3 text-sm">只指出错误位置</button>
          <button onClick={() => runAction("similar")} className="rounded-2xl bg-white/5 px-3 py-3 text-sm">给我两道类似题</button>
        </div>
      </GlassCard>

      <GlassCard className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI 返回</h2>
          <span className="text-xs text-white/50">{result.loading ? "处理中" : "已完成"}</span>
        </div>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-xs leading-6 text-white/80">{result.result}</pre>
      </GlassCard>

      <PrimaryButton href="/levels" className="mt-4">去继续闯关</PrimaryButton>
      <BottomNav />
    </Shell>
  );
}
