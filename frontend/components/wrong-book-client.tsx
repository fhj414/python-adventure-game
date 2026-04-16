"use client";

import { useMemo, useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, SecondaryButton, Shell } from "@/components/ui";
import { WrongRecord } from "@/lib/types";

export function WrongBookClient({ records }: { records: WrongRecord[] }) {
  const [filter, setFilter] = useState("全部");
  const points = useMemo(() => ["全部", ...Array.from(new Set(records.map((item) => item.knowledgePoint)))], [records]);
  const filtered = filter === "全部" ? records : records.filter((item) => item.knowledgePoint === filter);

  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">错题本</p>
        <h1 className="mt-2 text-2xl font-black">把每一次卡住，变成下次秒会</h1>
      </section>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {points.map((point) => (
          <button key={point} onClick={() => setFilter(point)} className={`rounded-full px-4 py-2 text-sm ${filter === point ? "bg-accent text-slate-950" : "bg-white/5 text-white/70"}`}>
            {point}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((record) => (
          <GlassCard key={record.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{record.levelTitle}</h3>
                <p className="mt-1 text-xs text-white/60">{record.knowledgePoint}</p>
              </div>
              <span className="rounded-full bg-red-400/15 px-3 py-1 text-xs text-red-200">待复盘</span>
            </div>
            <p className="mt-3 rounded-2xl bg-slate-950/70 p-3 text-xs leading-6 text-white/70">{record.errorMessage}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SecondaryButton href={`/levels/${record.levelId}`}>重新练习</SecondaryButton>
              <SecondaryButton href={`/coach?recordId=${record.id}`}>AI 复盘</SecondaryButton>
            </div>
          </GlassCard>
        ))}
      </div>
      <BottomNav />
    </Shell>
  );
}
