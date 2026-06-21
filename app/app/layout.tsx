import { AppShell } from "@/components/charging/app-shell";
import { ChargingProvider } from "@/components/charging/context";
import { CHARGERS, CHARGING_STATIONS } from "@/lib/charging/stations";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChargingProvider stations={CHARGING_STATIONS} chargers={CHARGERS}>
      <AppShell>{children}</AppShell>
    </ChargingProvider>
  );
}
