import { NextResponse } from "next/server";
import { isLocalDemoAuthEnabled } from "@/lib/auth/server/local-demo";
import { readProductBrandFile } from "@/lib/product/product-file";
import { hasSecretKey } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Liveness for standalone CareFlow — no database required. */
export async function GET() {
  const brand = await readProductBrandFile();
  const auth = hasSecretKey() ? "supabase" : isLocalDemoAuthEnabled() ? "local-demo" : "unconfigured";
  return NextResponse.json({
    ok: true,
    product: brand.productName,
    tagline: brand.productTagline,
    auth,
    checks: ["types", "local-auth", "clinical-ledger"]
  });
}
