"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-surface bg-grid bg-[size:24px_24px] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8 pt-5">{children}</div>
    </main>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={clsx("rounded-3xl border border-white/10 bg-card/80 p-4 shadow-glow backdrop-blur", className)}
    >
      {children}
    </motion.section>
  );
}

export function PrimaryButton({
  href,
  children,
  className,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const styles =
    "inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent2 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]";

  return href ? (
    <Link href={href} className={clsx(styles, className)}>
      {children}
    </Link>
  ) : (
    <button className={clsx(styles, className)}>{children}</button>
  );
}

export function SecondaryButton({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const styles =
    "inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10";

  return href ? (
    <Link href={href} className={clsx(styles, className)}>
      {children}
    </Link>
  ) : (
    <button className={clsx(styles, className)} onClick={onClick}>
      {children}
    </button>
  );
}

export function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
