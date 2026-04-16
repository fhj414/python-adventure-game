"use client";

import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import Link from "next/link";

import { BottomNav } from "@/components/bottom-nav";
import { GlassCard, Shell } from "@/components/ui";
import { BootstrapData } from "@/lib/types";

export function LevelsClient({ data }: { data: BootstrapData }) {
  return (
    <Shell>
      <section className="mb-4">
        <p className="text-sm text-white/60">关卡地图</p>
        <h1 className="mt-2 text-2xl font-black">七大世界，30 个 Python 挑战</h1>
      </section>
      <div className="space-y-4">
        {data.worlds.map((world, worldIndex) => (
          <GlassCard key={world.name}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">World {worldIndex + 1}</p>
                <h2 className="mt-1 text-lg font-bold">{world.name}</h2>
              </div>
              <div className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/60">{world.levels.length} 关</div>
            </div>
            <div className="space-y-3">
              {world.levels.map((level, index) => (
                <motion.div key={level.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}>
                  <Link href={level.unlocked ? `/levels/${level.id}` : "#"} className="block rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{level.title}</span>
                          {!level.unlocked && <Lock size={14} className="text-white/40" />}
                        </div>
                        <p className="mt-1 text-xs text-white/60">{level.knowledgePoint} · {level.difficulty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/50">{level.score} 分</p>
                        <div className="mt-1 flex justify-end gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star key={star} size={14} className={star <= level.stars ? "fill-warning text-warning" : "text-white/20"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
      <BottomNav />
    </Shell>
  );
}
