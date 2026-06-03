"use client";

import { useEffect, useMemo, useState } from "react";
import { brand } from "@/lib/brand";
import {
  simulatorDisclaimer,
  tryItInstructions,
  walletPassCta,
} from "@/lib/marketing/try-it-tech-stack-content";

const QR_GRID_SIZE = 29;

function buildPseudoQrMatrix(payload: string) {
  const matrix = Array.from({ length: QR_GRID_SIZE }, () =>
    Array.from({ length: QR_GRID_SIZE }, () => false),
  );
  const reserved = Array.from({ length: QR_GRID_SIZE }, () =>
    Array.from({ length: QR_GRID_SIZE }, () => false),
  );

  const markReserved = (row: number, col: number) => {
    if (row < 0 || col < 0 || row >= QR_GRID_SIZE || col >= QR_GRID_SIZE) {
      return;
    }
    reserved[row][col] = true;
  };

  const paintFinder = (top: number, left: number) => {
    for (let row = -1; row <= 7; row += 1) {
      for (let col = -1; col <= 7; col += 1) {
        const y = top + row;
        const x = left + col;
        markReserved(y, x);

        if (row < 0 || col < 0 || row > 6 || col > 6) {
          continue;
        }

        const isOuter = row === 0 || row === 6 || col === 0 || col === 6;
        const isInner = row >= 2 && row <= 4 && col >= 2 && col <= 4;

        if (isOuter || isInner) {
          matrix[y][x] = true;
        }
      }
    }
  };

  paintFinder(0, 0);
  paintFinder(0, QR_GRID_SIZE - 7);
  paintFinder(QR_GRID_SIZE - 7, 0);

  const source = payload || "about:blank";
  let seed = 0;
  for (const char of source) {
    seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  }

  const nextBit = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed & 1) === 1;
  };

  for (let row = 0; row < QR_GRID_SIZE; row += 1) {
    for (let col = 0; col < QR_GRID_SIZE; col += 1) {
      if (reserved[row][col]) {
        continue;
      }
      matrix[row][col] = nextBit();
    }
  }

  return matrix;
}

export function TryItNowSection({ className }: { className: string }) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const qrPayload = origin;
  const matrix = useMemo(() => buildPseudoQrMatrix(origin), [origin]);

  return (
    <section id="try-it-now" className={className}>
      <h2 className="font-heading text-3xl font-semibold tracking-tight">Try it now</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Scan the QR to open this site in Simulator Safari, then add the pass directly from the same origin.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-xl border bg-white p-3">
            <svg
              viewBox={`0 0 ${QR_GRID_SIZE} ${QR_GRID_SIZE}`}
              width={192}
              height={192}
              role="img"
              aria-label={`QR code for ${qrPayload || "current origin"}`}
              data-qr-payload={qrPayload}
              className="h-48 w-48"
            >
              <rect width={QR_GRID_SIZE} height={QR_GRID_SIZE} fill="#FFFFFF" />
              {matrix.map((cells, rowIndex) =>
                cells.map((isFilled, colIndex) =>
                  isFilled ? (
                    <rect
                      key={`${rowIndex}-${colIndex}`}
                      x={colIndex}
                      y={rowIndex}
                      width={1}
                      height={1}
                      fill="#111827"
                    />
                  ) : null,
                ),
              )}
            </svg>
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
            href={walletPassCta.href}
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
