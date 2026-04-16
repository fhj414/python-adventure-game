import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AudioDock } from "@/components/audio-dock";

import "./globals.css";

export const metadata: Metadata = {
  title: "PyRunner",
  description: "轻量游戏化 Python 学习平台",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <AudioDock />
        {children}
      </body>
    </html>
  );
}
