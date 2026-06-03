"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { brand } from "@/lib/brand";
import { saveOnboardedUser } from "@/lib/loyalty/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = usePwaSession();
  const [name, setName] = useState("");

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const user = saveOnboardedUser(name);
    if (!user) {
      return;
    }

    setUser(user);
    router.replace("/app");
  };

  return (
    <section className="mx-auto w-full max-w-sm">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Welcome</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Set up your rewards profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your first name to continue. We will keep your profile on this device only.
        </p>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="onboarding-name" className="block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="onboarding-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="given-name"
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2"
            style={{ borderColor: "rgb(212 212 216)", boxShadow: "none", caretColor: brand.colors.primary }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: brand.colors.primary }}
          >
            Continue
          </button>
        </form>
      </div>
    </section>
  );
}
