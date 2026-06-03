type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <section className="space-y-4 pb-12">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">App route</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="space-y-3">
        {[
          "This section is scaffolded as part of the PWA shell milestone.",
          "Bottom navigation and onboarding guards are active on this route.",
          "Feature-specific interactions land in subsequent milestones.",
          "Content length here supports sticky-nav verification while scrolling.",
        ].map((line) => (
          <p key={line} className="rounded-xl border bg-white p-3 text-sm text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
