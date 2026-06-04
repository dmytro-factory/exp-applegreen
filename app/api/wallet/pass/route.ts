import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PKPass } from "passkit-generator";
import {
  loadWalletPassCertificates,
  WalletPassConfigurationError,
} from "@/lib/wallet/certificates";
import { buildWalletPassJson } from "@/lib/wallet/pass";

export const runtime = "nodejs";

const ASSET_FILENAMES = ["icon.png", "icon@2x.png", "logo.png", "strip.png"] as const;
let cachedAssets: Record<(typeof ASSET_FILENAMES)[number], Buffer> | null = null;

async function readWalletAssets() {
  if (cachedAssets) {
    return cachedAssets;
  }

  const basePath = join(process.cwd(), "public", "wallet-assets");
  const loaded = await Promise.all(
    ASSET_FILENAMES.map(async (filename) => {
      const bytes = await readFile(join(basePath, filename));
      return [filename, bytes] as const;
    }),
  );

  cachedAssets = Object.fromEntries(loaded) as Record<(typeof ASSET_FILENAMES)[number], Buffer>;
  return cachedAssets;
}

function walletNotConfiguredResponse() {
  return Response.json(
    { error: "wallet pass not configured" },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedPoints = Number(searchParams.get("points"));
    const points = Number.isFinite(parsedPoints) ? parsedPoints : undefined;

    const passJson = buildWalletPassJson(
      {
        memberId: searchParams.get("member"),
        memberName: searchParams.get("name"),
        points,
        persistedTier: searchParams.get("tier"),
      },
      {
        passTypeIdentifier: process.env.PASS_TYPE_IDENTIFIER,
        teamIdentifier: process.env.PASS_TEAM_IDENTIFIER,
      },
    );

    const certificates = loadWalletPassCertificates(process.env);
    const assets = await readWalletAssets();

    const pass = new PKPass(
      {
        "pass.json": Buffer.from(`${JSON.stringify(passJson, null, 2)}\n`),
        ...assets,
      },
      certificates,
    );
    const passBuffer = pass.getAsBuffer();

    return new Response(new Uint8Array(passBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": 'attachment; filename="applegreen-rewards.pkpass"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof WalletPassConfigurationError) {
      return walletNotConfiguredResponse();
    }

    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
    } else {
      console.error(`UnknownError: ${String(error)}`);
    }

    return Response.json(
      { error: "wallet pass generation failed" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
