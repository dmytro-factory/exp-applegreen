import { brand } from "@/lib/brand";

type ApplegreenLogoProps = {
  className?: string;
};

export function ApplegreenLogo({ className }: ApplegreenLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`.trim()}>
      <span
        aria-hidden
        className="inline-block h-4 w-4 rounded-full"
        style={{ backgroundColor: brand.colors.primary }}
      />
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
        Applegreen
      </span>
    </span>
  );
}
