"use client";

import { Baby, Dog, ExternalLink, PlugZap, ToyBrick } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import {
  ROAD_TRIP_FAMILY_FILTERS,
  buildGoogleMapsDeepLink,
  filterRoadTripStopsByBadges,
  planRoadTrip,
  type RoadTripFamilyBadge,
} from "@/lib/road-trip";

const badgeIconMap: Record<RoadTripFamilyBadge, typeof ToyBrick> = {
  kids: ToyBrick,
  "baby-change": Baby,
  dog: Dog,
  ev: PlugZap,
};

const guidanceMessage = "Enter both a starting point and destination to plan your trip.";

export function RoadTripPlanner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlFrom = searchParams.get("from") ?? "";
  const urlTo = searchParams.get("to") ?? "";
  const submittedFrom = urlFrom.trim();
  const submittedTo = urlTo.trim();

  const [fromInput, setFromInput] = useState(urlFrom);
  const [toInput, setToInput] = useState(urlTo);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [activeBadges, setActiveBadges] = useState<RoadTripFamilyBadge[]>([]);
  const [preOrderMessage, setPreOrderMessage] = useState<string | null>(null);

  useEffect(() => {
    setFromInput(urlFrom);
  }, [urlFrom]);

  useEffect(() => {
    setToInput(urlTo);
  }, [urlTo]);

  const hasSubmittedRoute = submittedFrom.length > 0 && submittedTo.length > 0;

  const roadTripPlan = useMemo(
    () => (hasSubmittedRoute ? planRoadTrip(submittedFrom, submittedTo) : null),
    [hasSubmittedRoute, submittedFrom, submittedTo],
  );

  const filteredStops = useMemo(
    () => (roadTripPlan ? filterRoadTripStopsByBadges(roadTripPlan.stops, activeBadges) : []),
    [activeBadges, roadTripPlan],
  );

  const mapsHref = useMemo(() => {
    if (!hasSubmittedRoute || !roadTripPlan) {
      return null;
    }

    const mapStops = filteredStops.length > 0 ? filteredStops : roadTripPlan.stops;
    return buildGoogleMapsDeepLink(
      submittedFrom,
      submittedTo,
      mapStops.map((stop) => stop.waypoint),
    );
  }, [filteredStops, hasSubmittedRoute, roadTripPlan, submittedFrom, submittedTo]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFrom = fromInput.trim();
    const nextTo = toInput.trim();

    if (!nextFrom || !nextTo) {
      setValidationMessage(guidanceMessage);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", nextFrom);
    params.set("to", nextTo);

    setValidationMessage(null);
    setPreOrderMessage(null);
    setActiveBadges([]);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleToggleBadge = (badge: RoadTripFamilyBadge) => {
    setActiveBadges((current) =>
      current.includes(badge) ? current.filter((value) => value !== badge) : [...current, badge],
    );
  };

  const handlePreOrder = (stopName: string) => {
    setPreOrderMessage(`Pre-order stub confirmed for ${stopName}. We’ll prepare your coffee/food collection.`);
  };

  return (
    <section className="space-y-5 pb-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Road-trip planner</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Plan a family stop route</h1>
        <p className="text-sm text-muted-foreground">
          Enter any origin and destination. We&apos;ll match curated Applegreen motorway corridors when available.
        </p>
      </header>

      <form className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm" onSubmit={handleSubmit} noValidate>
        <label htmlFor="road-trip-from" className="block text-sm font-medium text-foreground">
          From
        </label>
        <input
          id="road-trip-from"
          name="from"
          value={fromInput}
          onChange={(event) => {
            setFromInput(event.target.value);
            if (validationMessage) {
              setValidationMessage(null);
            }
          }}
          placeholder="e.g. Dublin"
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2"
          style={{ borderColor: "rgb(212 212 216)", boxShadow: "none", caretColor: brand.colors.primary }}
        />

        <label htmlFor="road-trip-to" className="block pt-1 text-sm font-medium text-foreground">
          To
        </label>
        <input
          id="road-trip-to"
          name="to"
          value={toInput}
          onChange={(event) => {
            setToInput(event.target.value);
            if (validationMessage) {
              setValidationMessage(null);
            }
          }}
          placeholder="e.g. Galway"
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2"
          style={{ borderColor: "rgb(212 212 216)", boxShadow: "none", caretColor: brand.colors.primary }}
        />

        {validationMessage ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {validationMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          Plan trip
        </button>
      </form>

      {hasSubmittedRoute && roadTripPlan ? (
        <section className="space-y-3" aria-label="Road-trip results">
          {roadTripPlan.stops.length > 0 ? (
            <>
              <div className="space-y-1">
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Suggested Applegreen stops</h2>
                <p className="text-sm text-muted-foreground">
                  {roadTripPlan.corridorName} · {filteredStops.length} shown
                </p>
              </div>

              <div className="flex flex-wrap gap-2" aria-label="Family badge filters">
                {ROAD_TRIP_FAMILY_FILTERS.map((filter) => {
                  const isActive = activeBadges.includes(filter.id);
                  const Icon = badgeIconMap[filter.id];

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleToggleBadge(filter.id)}
                      aria-pressed={isActive}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        borderColor: isActive ? "var(--brand-primary)" : "rgb(212 212 216)",
                        backgroundColor: isActive ? "rgb(245 250 238)" : "white",
                        color: isActive ? "var(--brand-dark)" : "rgb(63 63 70)",
                        outlineColor: "var(--brand-primary)",
                      }}
                    >
                      <Icon aria-hidden className="h-4 w-4" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>

              {filteredStops.length === 0 ? (
                <p className="rounded-xl border bg-white px-3 py-2 text-sm text-muted-foreground">
                  No stops match all selected family badges. Toggle a filter off to restore the full list.
                </p>
              ) : (
                <ol className="space-y-3">
                  {filteredStops.map((stop) => (
                    <li key={stop.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{stop.name}</h3>
                          <p className="text-sm text-muted-foreground">{stop.distanceKm} km from {submittedFrom}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePreOrder(stop.name)}
                          className="inline-flex shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          style={{ borderColor: "var(--brand-primary)", outlineColor: "var(--brand-primary)" }}
                        >
                          Pre-order coffee/food
                        </button>
                      </div>

                      <ul className="mt-3 flex flex-wrap gap-2">
                        {stop.badges.map((badgeId) => {
                          const badge = ROAD_TRIP_FAMILY_FILTERS.find((filter) => filter.id === badgeId);
                          if (!badge) {
                            return null;
                          }

                          const Icon = badgeIconMap[badgeId];
                          return (
                            <li
                              key={`${stop.id}-${badgeId}`}
                              className="inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-xs font-medium text-foreground"
                              aria-label={badge.ariaLabel}
                            >
                              <Icon aria-hidden className="h-3.5 w-3.5" />
                              <span>{badge.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </>
          ) : (
            <p
              className="rounded-xl border px-3 py-2 text-sm font-medium"
              style={{ borderColor: "var(--brand-primary)", backgroundColor: "rgb(245 250 238)", color: "var(--brand-dark)" }}
              role="status"
            >
              We&apos;re adding curated Applegreen stops for this corridor soon. You can continue in Google Maps now.
            </p>
          )}

          {preOrderMessage ? (
            <p
              className="rounded-xl border px-3 py-2 text-sm font-medium"
              style={{ borderColor: "var(--brand-primary)", backgroundColor: "rgb(245 250 238)", color: "var(--brand-dark)" }}
              role="status"
            >
              {preOrderMessage}
            </p>
          ) : null}

          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: "var(--brand-primary)", outlineColor: "var(--brand-primary)" }}
            >
              Open in Google Maps
              <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
