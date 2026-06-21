"use client";

import Link from "next/link";
import {
  Bell,
  Car,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { useCharging } from "@/components/charging/context";
import { resetAccount, tierFromPoints } from "@/lib/loyalty/charging";

export default function ProfilePage() {
  const { account } = useCharging();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  if (!account) {
    return null;
  }

  const tier = tierFromPoints(account.points);

  const signOut = () => {
    resetAccount();
    window.location.assign("/app/auth");
  };

  return (
    <div className="space-y-5 px-4 py-4">
      <div className="rounded-3xl bg-white p-5 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full font-heading text-xl font-bold text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
            {account.name.charAt(0).toUpperCase() || "G"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-bold text-[#1A1A1A]">{account.name || "Guest"}</p>
            <p className="text-sm text-muted-foreground">{tier} · {account.points.toLocaleString()} points{account.guest ? " · Guest" : ""}</p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
        <MenuLink href="/app/vehicles" icon={<Car className="h-5 w-5" />} label="My vehicles" hint={`${account.vehicles.length}`} />
        <MenuLink href="/app/activity" icon={<Receipt className="h-5 w-5" />} label="Charging activity" hint={`${account.activity.length}`} />
        <MenuStatic icon={<CreditCard className="h-5 w-5" />} label="Payment methods" hint="Apple Pay" />
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Bell className="h-5 w-5 text-[#006551]" />
          <span className="flex-1 text-sm font-medium text-[#1A1A1A]">Notifications</span>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((value) => !value)}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ backgroundColor: notifications ? "var(--brand-primary)" : "#D1D5DB" }}
          >
            <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: notifications ? "1.5rem" : "0.125rem" }} />
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-[#f0f2f9] px-4 py-3.5">
          <Globe className="h-5 w-5 text-[#006551]" />
          <span className="flex-1 text-sm font-medium text-[#1A1A1A]">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg bg-[#EEF2FE] px-2 py-1 text-sm font-semibold text-[#3D3D3D]"
          >
            <option>English</option>
            <option>Gaeilge</option>
            <option>Polski</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
        <MenuStatic icon={<HelpCircle className="h-5 w-5" />} label="Help & support" />
        <MenuLink href="/" icon={<Info className="h-5 w-5" />} label="About this build" />
      </section>

      <button
        type="button"
        onClick={signOut}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D8DEEC] bg-white py-3 text-sm font-semibold text-[#B91C1C]"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

function MenuLink({ href, icon, label, hint }: { href: string; icon: React.ReactNode; label: string; hint?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 border-b border-[#f0f2f9] px-4 py-3.5 last:border-b-0">
      <span className="text-[#006551]">{icon}</span>
      <span className="flex-1 text-sm font-medium text-[#1A1A1A]">{label}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

function MenuStatic({ icon, label, hint }: { icon: React.ReactNode; label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#f0f2f9] px-4 py-3.5 last:border-b-0">
      <span className="text-[#006551]">{icon}</span>
      <span className="flex-1 text-sm font-medium text-[#1A1A1A]">{label}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
