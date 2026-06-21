"use client";

import { Car, CarFront, Check, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { BackBar } from "@/components/charging/chrome";
import { useCharging } from "@/components/charging/context";
import { CONNECTOR_LABELS, type ConnectorType } from "@/lib/charging/model";
import { addVehicle, removeVehicle, setDefaultVehicle, type VehicleKind } from "@/lib/loyalty/charging";

const CONNECTORS: ConnectorType[] = ["CCS", "CHAdeMO", "Type2"];

export default function VehiclesPage() {
  const { account, updateAccount } = useCharging();
  const [adding, setAdding] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [kind, setKind] = useState<VehicleKind>("ev");
  const [connector, setConnector] = useState<ConnectorType>("CCS");

  if (!account) {
    return null;
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    updateAccount(
      addVehicle(account, {
        nickname: `${make} ${model}`.trim() || "My vehicle",
        make: make.trim() || "Vehicle",
        model: model.trim(),
        kind,
        connector: kind === "ev" ? connector : null,
        isDefault: account.vehicles.length === 0,
      }),
    );
    setMake("");
    setModel("");
    setKind("ev");
    setConnector("CCS");
    setAdding(false);
  };

  return (
    <div className="pb-6">
      <BackBar title="My vehicles" />
      <div className="space-y-3 px-4 pt-4">
        {account.vehicles.length === 0 && !adding ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-muted-foreground">
            No vehicles yet. Add one to personalise connector filters.
          </p>
        ) : null}

        {account.vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brand-badge-bg)" }}>
              {vehicle.kind === "ev" ? <CarFront className="h-5 w-5 text-[#006551]" /> : <Car className="h-5 w-5 text-[#006551]" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#1A1A1A]">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-xs text-muted-foreground">
                {vehicle.kind === "ev" ? (vehicle.connector ? CONNECTOR_LABELS[vehicle.connector] : "EV") : "Petrol / Diesel"}
                {vehicle.isDefault ? " · Default" : ""}
              </p>
            </div>
            {!vehicle.isDefault ? (
              <button
                type="button"
                onClick={() => updateAccount(setDefaultVehicle(account, vehicle.id))}
                aria-label="Set as default"
                className="rounded-full p-2"
              >
                <Star className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : (
              <span className="rounded-full p-2"><Check className="h-4 w-4 text-[#006551]" /></span>
            )}
            <button
              type="button"
              onClick={() => updateAccount(removeVehicle(account, vehicle.id))}
              aria-label="Remove vehicle"
              className="rounded-full p-2"
            >
              <Trash2 className="h-4 w-4 text-[#B91C1C]" />
            </button>
          </div>
        ))}

        {adding ? (
          <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
            <div className="grid grid-cols-2 gap-2">
              <input value={make} onChange={(event) => setMake(event.target.value)} placeholder="Make" required className="rounded-xl border border-[#D8DEEC] px-3 py-2 text-sm outline-none" />
              <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Model" className="rounded-xl border border-[#D8DEEC] px-3 py-2 text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["ev", "ice"] as VehicleKind[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  className="rounded-xl border px-3 py-2 text-sm font-semibold"
                  style={{
                    borderColor: kind === value ? "var(--brand-primary)" : "#D8DEEC",
                    color: kind === value ? "var(--brand-primary)" : "#6B7280",
                  }}
                >
                  {value === "ev" ? "Electric" : "Petrol / Diesel"}
                </button>
              ))}
            </div>
            {kind === "ev" ? (
              <div className="flex gap-2">
                {CONNECTORS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setConnector(value)}
                    className="flex-1 rounded-xl border px-2 py-2 text-xs font-semibold"
                    style={{
                      borderColor: connector === value ? "var(--brand-primary)" : "#D8DEEC",
                      color: connector === value ? "var(--brand-primary)" : "#6B7280",
                    }}
                  >
                    {CONNECTOR_LABELS[value]}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex gap-2">
              <button type="button" onClick={() => setAdding(false)} className="flex-1 rounded-full border border-[#D8DEEC] py-2.5 text-sm font-semibold text-[#3D3D3D]">
                Cancel
              </button>
              <button type="submit" className="flex-1 rounded-full py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
                Save vehicle
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-[#A9C4BB] py-3 text-sm font-semibold text-[#006551]"
          >
            <Plus className="h-4 w-4" /> Add a vehicle
          </button>
        )}
      </div>
    </div>
  );
}
