"use client";

let audioContext: AudioContext | null = null;

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

function beep({
  frequency,
  duration,
  type = "square",
  volume = 0.03,
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
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export function playUiSound(kind: "run" | "success" | "error" | "hint" | "tap") {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  if (kind === "tap") {
    beep({ frequency: 560, duration: 0.06, type: "square", volume: 0.02 });
    return;
  }

  if (kind === "run") {
    beep({ frequency: 330, duration: 0.06, type: "triangle", volume: 0.025 });
    beep({ frequency: 440, duration: 0.08, type: "triangle", volume: 0.03, delay: 0.05 });
    return;
  }

  if (kind === "hint") {
    beep({ frequency: 660, duration: 0.05, type: "sine", volume: 0.02 });
    beep({ frequency: 880, duration: 0.09, type: "sine", volume: 0.025, delay: 0.05 });
    return;
  }

  if (kind === "error") {
    beep({ frequency: 240, duration: 0.08, type: "sawtooth", volume: 0.03 });
    beep({ frequency: 180, duration: 0.12, type: "sawtooth", volume: 0.028, delay: 0.06 });
    return;
  }

  beep({ frequency: 523, duration: 0.06, type: "square", volume: 0.03 });
  beep({ frequency: 659, duration: 0.08, type: "square", volume: 0.03, delay: 0.06 });
  beep({ frequency: 784, duration: 0.12, type: "square", volume: 0.035, delay: 0.14 });
}
