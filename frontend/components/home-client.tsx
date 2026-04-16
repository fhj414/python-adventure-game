"use client";

import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, PlayCircle, Rocket, Sparkles } from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, PrimaryButton, SecondaryButton, Shell, StatChip } from "@/components/ui";
import { BootstrapData } from "@/lib/types";

const actionCards = [
  { title: "开始闯关", desc: "从零开始刷第一关", href: "/levels", icon: PlayCircle },
  { title: "每日挑战", desc: "今天来一题快节奏练习", href: "/levels", icon: Rocket },
  { title: "错题本", desc: "把卡点逐个击破", href: "/wrong-book", icon: BookOpen },
  { title: "AI 教练", desc: "提示、讲解、类似题一键直达", href: "/coach", icon: BrainCircuit },
];

export function HomeClient({ data }: { data: BootstrapData }) {
  const currentLevel = data.worlds.flatMap((world) => world.levels).find((level) => level.id === data.user.currentLevelId);

  return (
    <Shell>
      <section className="mb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[32px] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-emerald-400/10 p-5">
          <p className="text-sm text-cyan-100/80">PyRunner</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">把 Python 学成一场轻冒险</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">适合零基础和有经验用户的移动端闯关学习。今天就能上线，今天就能开刷。</p>
        </motion.div>
      </section>

      <GlassCard className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/60">欢迎回来</p>
            <h2 className="mt-1 text-xl font-bold">{data.user.nickname}</h2>
            <p className="mt-2 text-sm text-white/70">当前进度：{currentLevel?.title ?? "开始你的第一关"}</p>
          </div>
          <div className="rounded-2xl bg-accent/15 p-3 text-accent">
            <Sparkles size={24} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatChip label="积分" value={data.user.totalPoints} />
          <StatChip label="连学天数" value={data.user.streakDays} />
          <StatChip label="等级" value={`Lv.${data.user.level}`} />
          <StatChip label="掌握知识点" value={data.user.masteredConcepts} />
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        {actionCards.map(({ title, desc, href, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-3 inline-flex rounded-2xl bg-white/10 p-2 text-accent2">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 min-h-10 text-xs leading-5 text-white/65">{desc}</p>
            <SecondaryButton href={href} className="mt-3">
              前往
            </SecondaryButton>
          </motion.div>
        ))}
      </div>

      <GlassCard className="mt-4">
        <p className="text-sm text-white/60">继续学习</p>
        <h3 className="mt-2 text-lg font-semibold">{currentLevel?.title ?? "从第一关起步"}</h3>
        <p className="mt-2 text-sm text-white/70">{currentLevel?.knowledgePoint ?? "print / 变量 / 条件 / 循环 / 函数"}</p>
        <PrimaryButton href={currentLevel ? `/levels/${currentLevel.id}` : "/levels"} className="mt-4">
          继续学习
        </PrimaryButton>
      </GlassCard>

      <BottomNav />
    </Shell>
  );
}
