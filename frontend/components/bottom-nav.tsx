"use client";

import clsx from "clsx";
import { Home, Map, Sparkles, TriangleAlert, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页", icon: Home },
  { href: "/levels", label: "地图", icon: Map },
  { href: "/coach", label: "AI", icon: Sparkles },
  { href: "/wrong-book", label: "错题", icon: TriangleAlert },
  { href: "/profile", label: "我的", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-3 mt-auto rounded-full border border-white/10 bg-slate-950/80 p-2 backdrop-blur">
      <ul className="grid grid-cols-5 gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 rounded-full px-2 py-2 text-[11px] transition",
                  active ? "bg-white/10 text-accent" : "text-white/70",
                )}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
