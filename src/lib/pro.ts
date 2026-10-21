import ExtPay from "extpay";
import { EXTPAY_ID } from "@/config";
import { isExtension } from "./tabs";

// Thin wrapper around ExtensionPay so the popup still renders in the dev preview.
const extpay = isExtension ? ExtPay(EXTPAY_ID) : null;

export async function isProUser(): Promise<boolean> {
  if (!extpay) return false;
  try {
    const user = await extpay.getUser();
    return user.paid;
  } catch {
    // Offline or ExtensionPay unreachable: fall back to free features.
    return false;
  }
}

export function openUpgradePage(): void {
  if (!extpay) {
    window.alert("ExtensionPay checkout only works inside the installed extension.");
    return;
  }
  extpay.openPaymentPage();
}

export function onProUnlocked(callback: () => void): void {
  extpay?.onPaid.addListener(callback);
}
