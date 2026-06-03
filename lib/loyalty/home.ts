import { tierFromPoints, type LoyaltyTier } from "./storage";

export const PARCELCONNECT_NOTIFICATION_COPY = "Parcel ready at Applegreen Naas Road";
export const ROAD_TRIP_CTA_HREF = "/app/road-trip";

export type TodayOffer = {
  title: string;
  detail: string;
  badge: string;
};

export type PartnerOffer = {
  name: string;
  logoSrc: string;
  discountLabel: string;
};

export type TierProgress = {
  tier: LoyaltyTier;
  percent: number;
  remainingPoints: number;
};

export const TODAYS_OFFERS: TodayOffer[] = [
  {
    title: "Double points on premium fuel",
    detail: "Fill 35L or more before 10pm to collect 2x points today.",
    badge: "Fuel",
  },
  {
    title: "Coffee + pastry combo",
    detail: "Save €1.50 when you pick any Bloom coffee with a bakery treat.",
    badge: "In-store",
  },
  {
    title: "Family road-trip snack bundle",
    detail: "Get 20% off selected snack bundles on motorway stops.",
    badge: "Family",
  },
];

export const PARTNER_OFFERS: PartnerOffer[] = [
  {
    name: "GoCar",
    logoSrc: "/images/partners/gocar.svg",
    discountLabel: "15% off day rentals",
  },
  {
    name: "Insomnia",
    logoSrc: "/images/partners/insomnia.svg",
    discountLabel: "2-for-1 medium coffee",
  },
  {
    name: "Circle K Car Wash",
    logoSrc: "/images/partners/carwash.svg",
    discountLabel: "€4 off premium wash",
  },
];

function clampPercent(value: number): number {
  const bounded = Math.max(0, Math.min(100, value));
  return Math.round(bounded * 10) / 10;
}

export function getTierProgress(points: number): TierProgress {
  const normalizedPoints = Math.max(0, Math.floor(points));
  const tier = tierFromPoints(normalizedPoints);

  if (tier === "Gold") {
    return {
      tier,
      percent: 100,
      remainingPoints: 0,
    };
  }

  if (tier === "Silver") {
    return {
      tier,
      percent: clampPercent(((normalizedPoints - 500) / 1000) * 100),
      remainingPoints: Math.max(0, 1500 - normalizedPoints),
    };
  }

  return {
    tier,
    percent: clampPercent((normalizedPoints / 500) * 100),
    remainingPoints: Math.max(0, 500 - normalizedPoints),
  };
}
