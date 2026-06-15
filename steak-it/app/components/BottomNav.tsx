"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const todayActive = pathname === "/";
  const profileActive = pathname === "/profile";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <Link
          href="/"
          className={`text-sm font-semibold ${
            todayActive ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          Today
        </Link>

        <Link
          href="/profile"
          className={`text-sm font-semibold ${
            profileActive ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}