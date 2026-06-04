"use client";

import dynamic from "next/dynamic";

const StationsMap = dynamic(
  () => import("@/components/pwa/stations-map").then((module) => module.StationsMap),
  { ssr: false },
);

export default function StationsPage() {
  return <StationsMap />;
}
