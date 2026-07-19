/**
 * Lightweight analytics — routes NEET analyzer events to the Meta Pixel that is
 * already installed in the root layout. No new tracking infra. Safe on the
 * server (no-ops) and when the pixel is blocked/absent.
 */

type FbqParams = Record<string, string | number | boolean | undefined>;

export type NeetEvent =
  | "analyze_clicked"
  | "registration_completed"
  | "lead_delivery_failed"
  | "whatsapp_cta_clicked"
  | "ipad_offer_clicked"
  | "callback_requested"
  | "page_scroll_depth";

export function trackEvent(event: NeetEvent, params: FbqParams = {}): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  try {
    fbq?.("trackCustom", event, params);
  } catch {
    /* never let analytics break the UI */
  }
}
