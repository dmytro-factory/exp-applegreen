"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";
import {
  LOYALTY_USER_STORAGE_KEY,
  LOYALTY_USER_UPDATED_EVENT,
  readLoyaltyUser,
} from "@/lib/loyalty/storage";
import { createQrDataUrl } from "@/lib/qr";
import { buildWalletPassHref } from "@/lib/wallet/cta";
import {
  simulatorDisclaimer,
  tryItInstructions,
  walletPassCta,
} from "@/lib/marketing/try-it-tech-stack-content";

export function TryItNowSection({ className }: { className: string }) {
  const [origin, setOrigin] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [walletHref, setWalletHref] = useState(() => buildWalletPassHref(null));

  useEffect(() => {
    const syncWalletHref = () => {
      setWalletHref(buildWalletPassHref(readLoyaltyUser()));
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === LOYALTY_USER_STORAGE_KEY) {
        syncWalletHref();
      }
    };

    const handleUserUpdated = () => {
      syncWalletHref();
    };

    setOrigin(window.location.origin);
    syncWalletHref();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOYALTY_USER_UPDATED_EVENT, handleUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOYALTY_USER_UPDATED_EVENT, handleUserUpdated);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void createQrDataUrl(origin || "about:blank", 192)
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (isMounted) {
          setQrDataUrl("");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [origin]);

  const qrPayload = origin || "about:blank";

  return (
    <section id="try-it-now" className={className}>
      <h2 className="font-heading text-3xl font-semibold tracking-tight">Try it now</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Scan the QR to open this site in Simulator Safari, then add the pass directly from the same origin.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-xl border bg-white p-3">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                width={192}
                height={192}
                alt={`QR code for ${qrPayload}`}
                data-qr-payload={qrPayload}
                className="h-48 w-48"
                unoptimized
              />
            ) : (
              <div
                aria-hidden
                className="h-48 w-48 animate-pulse rounded-lg bg-muted"
                data-qr-payload={qrPayload}
              />
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            QR payload origin:{" "}
            <span className="font-semibold text-foreground">
              {qrPayload || "Detecting current origin..."}
            </span>
          </p>
        </div>

        <div className="space-y-5">
          <ol className="space-y-3">
            {tryItInstructions.map((instruction, index) => (
              <li key={instruction} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-foreground">{instruction}</span>
              </li>
            ))}
          </ol>

          <a
            href={walletHref}
            aria-label="Add to Apple Wallet"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: brand.colors.primary, outlineColor: brand.colors.primary }}
          >
            {walletPassCta.label}
          </a>

          <p className="max-w-xl rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {simulatorDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
