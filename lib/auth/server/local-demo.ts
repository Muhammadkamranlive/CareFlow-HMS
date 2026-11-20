import { DEMO_PASSWORD } from "@/lib/auth/constants";
import { demoUsers, type RoleKey } from "@/lib/permissions";
import { hasSecretKey } from "@/lib/supabase/server";

export type LocalDemoProfile = {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  title: string;
  tenantId: string;
  status: "active";
};

/** Standalone CareFlow can sign in without Supabase. Production stays closed unless explicitly enabled. */
export function isLocalDemoAuthEnabled() {
  if (hasSecretKey()) return false;
  if (process.env.CAREFLOW_LOCAL_AUTH === "false") return false;
  if (process.env.NODE_ENV === "production" && process.env.CAREFLOW_LOCAL_AUTH !== "true") return false;
  return true;
}

export function findLocalDemoUser(email: string): LocalDemoProfile | null {
  const user = demoUsers.find((row) => row.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return null;
  return {
    id: `local-${user.email}`,
    email: user.email,
    name: user.name,
    role: user.role,
    title: user.title,
    tenantId: "alpha",
    status: "active"
  };
}

export function authenticateLocalDemo(email: string, password: string): LocalDemoProfile | null {
  if (!isLocalDemoAuthEnabled()) return null;
  if (password !== DEMO_PASSWORD) return null;
  return findLocalDemoUser(email);
}
