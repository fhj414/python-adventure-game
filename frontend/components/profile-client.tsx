"use client";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, Shell, StatChip } from "@/components/ui";
import { ProfileData } from "@/lib/types";

export function ProfileClient({ data }: { data: ProfileData }) {
  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">个人中心</p>
        <h1 className="mt-2 text-2xl font-black">{data.nickname}</h1>
      </section>
      <GlassCard>
        <div className="grid grid-cols-2 gap-3">
          <StatChip label="积分" value={data.totalPoints} />
          <StatChip label="等级" value={`Lv.${data.level}`} />
          <StatChip label="连续学习" value={`${data.streakDays} 天`} />
          <StatChip label="掌握知识点" value={data.masteredConcepts} />
          <StatChip label="已通关" value={`${data.completedLevels} 关`} />
          <StatChip label="徽章数" value={data.badges.length} />
        </div>
      </GlassCard>
      <div className="mt-4 space-y-3">
        {data.badges.map((badge) => (
          <GlassCard key={badge.name} className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">{badge.icon}</div>
            <div>
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="mt-1 text-sm text-white/65">{badge.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>
      <BottomNav />
    </Shell>
  );
}
