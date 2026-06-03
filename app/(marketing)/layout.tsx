import type { Metadata } from "next";
import { ApplegreenLogo } from "@/components/brand/applegreen-logo";
import { InPageNav } from "@/components/marketing/in-page-nav";
import { marketingPageMap, marketingShellMetadata } from "@/lib/marketing/page-map";

export const metadata: Metadata = {
  title: marketingShellMetadata.title,
  description: marketingShellMetadata.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <a
            href="#hero"
            aria-label="Applegreen logo and home"
            className="inline-flex w-fit items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
          >
            <ApplegreenLogo />
          </a>
          <InPageNav sections={marketingPageMap} />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Applegreen Rewards 2.0</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#hero"
              className="rounded-md transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
            >
              Back to top
            </a>
            <a
              href="#tech-stack"
              className="rounded-md transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
            >
              Tech stack
            </a>
            <a
              href="https://github.com/dmytro-factory/exp-applegreen"
              rel="noreferrer"
              className="rounded-md transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
            >
              GitHub repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
