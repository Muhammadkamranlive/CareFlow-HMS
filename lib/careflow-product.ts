import type { ModuleKey } from "@/lib/permissions";

/**
 * CareFlow is a branded hospital product, not the BusinessSuite app catalog.
 * Administration stays so a company can manage users, access, and billing.
 */
export const CAREFLOW_PRODUCT_MODULES: ModuleKey[] = ["healthcare", "settings"];

export function isCareFlowProductModule(key: ModuleKey) {
  return CAREFLOW_PRODUCT_MODULES.includes(key);
}
