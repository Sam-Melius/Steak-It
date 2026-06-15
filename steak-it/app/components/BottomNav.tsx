import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-400"
        >
          Today
        </Link>
        <Link
          href="/profile"
          className="text-sm font-semibold text-slate-300"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}