import { brand } from "@/lib/brand";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Applegreen Rewards 2.0
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight" style={{ color: brand.colors.primary }}>
          Foundation scaffold is ready
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Next.js 15 + Tailwind 4 + shadcn/ui + vitest baseline is configured.
        </p>
      </section>
    </main>
  );
}
