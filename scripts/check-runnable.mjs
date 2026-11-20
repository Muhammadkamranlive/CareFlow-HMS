#!/usr/bin/env node
/**
 * Standalone CareFlow checks: files, types, clinical ledger, optional HTTP smoke.
 * Usage: node scripts/check-runnable.mjs [--server]
 */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const withServer = process.argv.includes("--server");
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}
function has(file) {
  return fs.existsSync(path.join(root, file));
}

console.log("CareFlow HMS runnable checks\n");

for (const file of [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "config/product.json",
  "app/api/health/route.ts",
  "app/healthcare/billing/page.tsx",
  "lib/auth/server/local-demo.ts",
  "modules/healthcare/services/hms-ledger.ts",
  "modules/healthcare/services/hms-demo-seed.ts"
]) {
  if (has(file)) ok(file);
  else fail(`missing ${file}`);
}

try {
  const brand = JSON.parse(fs.readFileSync(path.join(root, "config/product.json"), "utf8"));
  if (brand.productName === "CareFlow") ok(`product brand is ${brand.productName}`);
  else fail(`config/product.json productName is ${brand.productName ?? "empty"}`);
} catch (err) {
  fail(`config/product.json unreadable: ${err instanceof Error ? err.message : err}`);
}

try {
  const workspace = fs.readFileSync(path.join(root, "pnpm-workspace.yaml"), "utf8");
  if (/packages:/.test(workspace)) ok("pnpm workspace declares packages");
  else fail("pnpm-workspace.yaml is missing a packages field (pnpm install will fail)");
} catch (err) {
  fail(`pnpm-workspace.yaml unreadable: ${err instanceof Error ? err.message : err}`);
}

try {
  execSync("pnpm exec tsc --noEmit --pretty false", { cwd: root, stdio: "pipe" });
  ok("TypeScript check passed");
} catch (err) {
  const stderr = err && typeof err === "object" && "stderr" in err ? String(err.stderr) : "";
  fail("TypeScript check failed");
  if (stderr.trim()) console.error(stderr.trim().split("\n").slice(0, 40).join("\n"));
}

try {
  execSync("node --experimental-strip-types scripts/check-ledger.mts", { cwd: root, stdio: "inherit" });
  ok("Clinical ledger self-check passed");
} catch {
  fail("Clinical ledger self-check failed");
}

if (withServer) {
  const port = process.env.PORT || "3000";
  const base = `http://127.0.0.1:${port}`;
  const child = spawn("pnpm", ["exec", "next", "dev", "--webpack", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NEXT_PUBLIC_DB_PRIMARY: process.env.NEXT_PUBLIC_DB_PRIMARY ?? "" }
  });
  let log = "";
  child.stdout?.on("data", (chunk) => {
    log += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    log += chunk.toString();
  });

  const deadline = Date.now() + 120_000;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/api/health`);
      if (res.ok) {
        ready = true;
        const body = await res.json();
        if (body.ok && body.product === "CareFlow") ok(`health ${base}/api/health (${body.auth})`);
        else fail(`health payload unexpected: ${JSON.stringify(body)}`);
        break;
      }
    } catch {
      /* server still booting */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (!ready) {
    fail("dev server did not answer /api/health within 120s");
    console.error(log.slice(-2000));
  } else {
    try {
      const login = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@demo.com", password: "Demo@12345" })
      });
      const body = await login.json();
      if (login.ok && body.ok && body.profile?.email === "admin@demo.com") {
        ok("local demo login accepted admin@demo.com");
      } else {
        fail(`local demo login failed (${login.status}): ${body.error ?? JSON.stringify(body)}`);
      }
    } catch (err) {
      fail(`local demo login request failed: ${err instanceof Error ? err.message : err}`);
    }
  }
  child.kill("SIGTERM");
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
