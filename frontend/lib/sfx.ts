"use client";

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bgmGain: GainNode | null = null;
let bgmStarted = false;
let bgmTimer: number | null = null;

function getContext() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioContext) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioContext = Ctx ? new Ctx() : null;
  }
  return audioContext;
}

function getMasterGain(ctx: AudioContext) {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

function getBgmGain(ctx: AudioContext) {
  if (!bgmGain) {
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.05;
    bgmGain.connect(getMasterGain(ctx));
  }
  return bgmGain;
}

export async function primeAudio() {
  const ctx = getContext();
  if (!ctx) {
    return false;
  }
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx.state === "running";
}

function beep({
  frequency,
  duration,
  type = "square",
  volume = 0.18,
  delay = 0,
}: {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}) {
  const ctx = getContext();
  if (!ctx) {
    return;
  }

  const startAt = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(getMasterGain(ctx));
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function tone({
  frequency,
  startAt,
  duration,
  type = "square",
  volume = 0.05,
}: {
  frequency: number;
  startAt: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
}) {
  const ctx = getContext();
  if (!ctx) {
    return;
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.linearRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(getBgmGain(ctx));
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function scheduleBgmBar(barStart: number) {
  const melody = [659, 784, 880, 784, 659, 784, 988, 784];
  const bass = [165, 165, 196, 196];
  const beat = 0.24;

  melody.forEach((frequency, index) => {
    tone({
      frequency,
      startAt: barStart + index * beat,
      duration: 0.16,
      type: "square",
      volume: 0.045,
    });
  });

  bass.forEach((frequency, index) => {
    tone({
      frequency,
      startAt: barStart + index * beat * 2,
      duration: 0.28,
      type: "triangle",
      volume: 0.035,
    });
  });

  [0, 2, 4, 6].forEach((step) => {
    tone({
      frequency: 1320,
      startAt: barStart + step * beat,
      duration: 0.05,
      type: "square",
      volume: 0.02,
    });
  });
}

function startBgmLoop() {
  const ctx = getContext();
  if (!ctx || bgmStarted) {
    return;
  }
  bgmStarted = true;

  let nextBar = ctx.currentTime + 0.05;
  scheduleBgmBar(nextBar);
  nextBar += 1.92;

  bgmTimer = window.setInterval(() => {
    const current = getContext();
    if (!current || !bgmStarted) {
      return;
    }
    while (nextBar < current.currentTime + 0.6) {
      scheduleBgmBar(nextBar);
      nextBar += 1.92;
    }
  }, 400);
}

export async function enableBgm() {
  const ok = await primeAudio();
  if (!ok) {
    return false;
  }
  startBgmLoop();
  return true;
}

export function disableBgm() {
  bgmStarted = false;
  if (bgmTimer !== null) {
    window.clearInterval(bgmTimer);
    bgmTimer = null;
  }
}

export function isBgmRunning() {
  return bgmStarted;
}

export async function playUiSound(kind: "run" | "success" | "error" | "hint" | "tap") {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  if (kind === "tap") {
    beep({ frequency: 740, duration: 0.08, type: "square", volume: 0.12 });
    return;
  }

  if (kind === "run") {
    beep({ frequency: 330, duration: 0.08, type: "triangle", volume: 0.13 });
    beep({ frequency: 520, duration: 0.11, type: "triangle", volume: 0.15, delay: 0.06 });
    return;
  }

  if (kind === "hint") {
    beep({ frequency: 720, duration: 0.06, type: "sine", volume: 0.11 });
    beep({ frequency: 980, duration: 0.12, type: "sine", volume: 0.13, delay: 0.05 });
    return;
  }

  if (kind === "error") {
    beep({ frequency: 240, duration: 0.1, type: "sawtooth", volume: 0.16 });
    beep({ frequency: 160, duration: 0.15, type: "sawtooth", volume: 0.18, delay: 0.07 });
    return;
  }

  beep({ frequency: 523, duration: 0.08, type: "square", volume: 0.13 });
  beep({ frequency: 659, duration: 0.1, type: "square", volume: 0.15, delay: 0.08 });
  beep({ frequency: 784, duration: 0.16, type: "square", volume: 0.18, delay: 0.18 });
}
