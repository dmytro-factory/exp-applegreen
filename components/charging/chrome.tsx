"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackBar({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-[#e3e7f2] bg-white/95 px-2 py-2 backdrop-blur">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="rounded-full p-1.5 hover:bg-muted"
      >
        <ChevronLeft className="h-6 w-6 text-[#1A1A1A]" />
      </button>
      <h1 className="min-w-0 flex-1 truncate font-heading text-lg font-semibold text-[#1A1A1A]">{title}</h1>
      {right ? <div className="shrink-0 pr-1">{right}</div> : null}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </h2>
  );
}
