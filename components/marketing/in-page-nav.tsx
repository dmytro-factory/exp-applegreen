"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { brand } from "@/lib/brand";
import type { MarketingSection } from "@/lib/marketing/page-map";

type InPageNavProps = {
  sections: MarketingSection[];
};

export function InPageNav({ sections }: InPageNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "hero");

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && sections.some((section) => section.id === initialHash)) {
      setActiveId(initialHash);
    }

    const observedElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible) {
          return;
        }

        const nextId = mostVisible.target.id;
        setActiveId(nextId);

        const nextHash = `#${nextId}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, "", nextHash);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    observedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
  };

  return (
    <nav aria-label="In-page sections" className="overflow-x-auto pb-1">
      <ul className="flex min-w-max items-center gap-2 pr-2">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => onNavClick(event, section.id)}
                className="rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: isActive ? brand.colors.primary : "color-mix(in srgb, currentColor 14%, transparent)",
                  backgroundColor: isActive
                    ? "color-mix(in srgb, var(--brand-primary) 14%, white)"
                    : "transparent",
                  outlineColor: brand.colors.primary,
                }}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
