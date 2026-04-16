"use client";

import { Music2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

import { disableBgm, enableBgm, isBgmRunning, playUiSound } from "@/lib/sfx";

export function AudioDock() {
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    setBgmOn(isBgmRunning());
  }, []);

  async function toggleBgm() {
    if (bgmOn) {
      disableBgm();
      setBgmOn(false);
      return;
    }

    const ok = await enableBgm();
    if (ok) {
      setBgmOn(true);
      await playUiSound("tap");
    }
  }

  return (
    <button
      onClick={toggleBgm}
      className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white backdrop-blur"
    >
      <Music2 size={14} className={bgmOn ? "text-warning" : "text-white/50"} />
      <span>{bgmOn ? "背景音开" : "背景音关"}</span>
      {bgmOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
    </button>
  );
}
