import { brand } from "@/lib/brand";
import {
  phaseTwoCallout,
  techStackItems,
} from "@/lib/marketing/try-it-tech-stack-content";

export function TechStackSection({ className }: { className: string }) {
  return (
    <section id="tech-stack" className={`${className} border-y`}>
      <h2 className="font-heading text-3xl font-semibold tracking-tight">Tech stack &amp; next steps</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Built as a Next.js demo with Applegreen brand tokens and a wallet-first customer journey.
      </p>

      <ul className="mt-8 space-y-3">
        {techStackItems.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-foreground">
            <span
              aria-hidden
              className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: brand.colors.primary }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <aside className="mt-8 rounded-2xl border bg-card p-5">
        <h3 className="text-lg font-semibold tracking-tight">{phaseTwoCallout.title}</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {phaseTwoCallout.items.map((item) => (
            <li key={item} className="leading-6">
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
