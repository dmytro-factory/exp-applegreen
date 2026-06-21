"use client";

import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { ApplegreenLogo } from "@/components/brand/applegreen-logo";
import { useCharging } from "@/components/charging/context";
import { createAccount } from "@/lib/loyalty/charging";

type Mode = "login" | "create";

export default function AuthPage() {
  const router = useRouter();
  const { updateAccount } = useCharging();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const displayName = mode === "create" ? name : email.split("@")[0] || "Driver";
    updateAccount(createAccount(displayName, false));
    router.replace("/app");
  };

  const continueAsGuest = () => {
    updateAccount(createAccount("Guest", true));
    router.replace("/app");
  };

  return (
    <div
      className="flex min-h-screen flex-col px-6 pb-10 pt-16"
      style={{ background: "linear-gradient(180deg, #006551 0%, #00402F 100%)" }}
    >
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <ApplegreenLogo />
          <h1 className="font-heading text-2xl font-bold text-white">Fast Charge</h1>
          <p className="max-w-[260px] text-sm text-white/80">
            Find ultra-rapid charging, pay contactless and earn rewards on every kWh.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <div className="mb-4 grid grid-cols-2 rounded-full bg-[#EEF2FE] p-1 text-sm font-semibold">
            {(["login", "create"] as Mode[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className="rounded-full py-2 transition-colors"
                style={{
                  backgroundColor: mode === value ? "white" : "transparent",
                  color: mode === value ? "var(--brand-primary)" : "#6B7280",
                  boxShadow: mode === value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {value === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "create" ? (
              <Field icon={<User className="h-4 w-4" />}>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            ) : null}
            <Field icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />}>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <button
              type="submit"
              className="w-full rounded-full py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={continueAsGuest}
            className="mt-3 w-full rounded-full border border-[#D8DEEC] py-3 text-sm font-semibold text-[#3D3D3D]"
          >
            Continue as guest
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-white/60">
        Demo experience. No real account is created.
      </p>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-[#D8DEEC] bg-white px-3 py-2.5 text-[#6B7280]">
      {icon}
      {children}
    </label>
  );
}
