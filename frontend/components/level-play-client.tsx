"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, PrimaryButton, SecondaryButton, Shell } from "@/components/ui";
import { api } from "@/lib/api";
import { playUiSound, primeAudio } from "@/lib/sfx";
import { LevelDetail, RunResult } from "@/lib/types";

export function LevelPlayClient({ level }: { level: LevelDetail }) {
  const [mode, setMode] = useState<"beginner" | "pro">("beginner");
  const [code, setCode] = useState(level.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [aiText, setAiText] = useState("点一下提示或 AI 讲解，旁边就会出现结果。");
  const [soundOn, setSoundOn] = useState(true);

  async function runCode() {
    setLoading(true);
    if (soundOn) {
      await primeAudio();
      await playUiSound("run");
    }
    const response = (await api.runCode({
      user_id: 1,
      level_id: level.id,
      code,
      mode,
      used_hint: usedHint,
    })) as RunResult;
    setResult(response);
    if (soundOn) {
      await playUiSound(response.success ? "success" : "error");
    }
    setLoading(false);
  }

  async function fetchHint() {
    setUsedHint(true);
    if (soundOn) {
      await primeAudio();
      await playUiSound("hint");
    }
    const response = await api.aiHint({ level_id: level.id, user_code: code });
    setAiText(response.data.message ?? JSON.stringify(response.data, null, 2));
  }

  async function fetchExplain() {
    if (soundOn) {
      await primeAudio();
      await playUiSound("tap");
    }
    const response = await api.aiExplain({ level_id: level.id, user_code: code, error: result?.message ?? "" });
    setAiText(response.data.message ?? JSON.stringify(response.data, null, 2));
  }

  async function toggleSound() {
    if (!soundOn) {
      const unlocked = await primeAudio();
      setSoundOn(true);
      if (unlocked) {
        await playUiSound("tap");
      }
      return;
    }
    setSoundOn(false);
  }

  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">{level.world}</p>
        <h1 className="mt-2 text-2xl font-black">{level.title}</h1>
        <p className="mt-2 text-sm text-white/70">{level.knowledgePoint} · {level.conceptTags.join(" / ")}</p>
      </section>

      <GlassCard>
        <p className="text-sm leading-6 text-white/85">{level.description}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setMode("beginner")} className={`rounded-full px-3 py-2 text-xs ${mode === "beginner" ? "bg-accent text-slate-950" : "bg-white/5 text-white/70"}`}>新手模板</button>
          <button onClick={() => setMode("pro")} className={`rounded-full px-3 py-2 text-xs ${mode === "pro" ? "bg-accent2 text-slate-950" : "bg-white/5 text-white/70"}`}>高级直写</button>
          <button onClick={toggleSound} className={`rounded-full px-3 py-2 text-xs ${soundOn ? "bg-warning text-slate-950" : "bg-white/5 text-white/70"}`}>{soundOn ? "音效开" : "音效关"}</button>
        </div>
      </GlassCard>

      <GlassCard className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">代码编辑区</h2>
          <button onClick={() => setCode(level.starterCode)} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs">
            <RotateCcw size={14} /> 重置
          </button>
        </div>
        <textarea value={code} onChange={(event) => setCode(event.target.value)} className="min-h-64 w-full rounded-3xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-6 outline-none" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={runCode} className="rounded-2xl bg-gradient-to-r from-accent to-accent2 px-4 py-3 text-sm font-semibold text-slate-950">{loading ? "运行中..." : "运行代码"}</button>
          <button onClick={() => setCode(level.starterCode)} className="rounded-2xl bg-white/5 px-4 py-3 text-sm">重置代码</button>
          <button onClick={fetchHint} className="rounded-2xl bg-white/5 px-4 py-3 text-sm">查看提示</button>
          <button onClick={fetchExplain} className="rounded-2xl bg-white/5 px-4 py-3 text-sm">AI 讲解</button>
        </div>
      </GlassCard>

      <GlassCard className="mt-4">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-accent" />
          <h2 className="font-semibold">AI 教练</h2>
        </div>
        <p className="mt-3 rounded-2xl bg-slate-950/70 p-4 text-sm leading-6 text-white/80">{aiText}</p>
      </GlassCard>

      <GlassCard className="mt-4">
        <h2 className="font-semibold">结果输出区</h2>
        <pre className="mt-3 min-h-24 whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-xs leading-6 text-white/80">{result?.output || "运行后将在这里显示输出或报错。"}</pre>
        <div className="mt-4 space-y-2">
          {level.testCases.map((testCase, index) => {
            const passed = result?.tests[index]?.passed;
            return (
              <div key={`${testCase.type}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span>测试 {index + 1}</span>
                  <span className={passed ? "text-accent" : "text-white/45"}>{passed ? "通过" : "待通过"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {result?.success && (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
          <GlassCard className="border-accent/30 bg-gradient-to-br from-accent/20 to-accent2/10">
            <div className="flex items-center gap-2">
              <Sparkles className="text-warning" size={18} />
              <h2 className="font-bold">通关奖励</h2>
            </div>
            <p className="mt-3 text-sm text-white/85">{result.message}</p>
            <p className="mt-2 text-sm text-white/70">得分 {result.score} · 星级 {result.stars} · 奖励 {level.coinReward} 金币 / {level.xpReward} 经验</p>
          </GlassCard>
        </motion.div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SecondaryButton href="/levels">返回地图</SecondaryButton>
        <PrimaryButton href="/coach">问 AI 教练</PrimaryButton>
      </div>
      <BottomNav />
    </Shell>
  );
}
