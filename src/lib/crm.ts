/**
 * CRM lead ingest helper — SERVER-SIDE ONLY.
 *
 * Forwards a successful website form submission to the ABHA CRM as a web lead.
 * Reads CRM_INGEST_URL + CRM_API_KEY from process.env, so the secret key never
 * reaches the browser. This helper is designed to be completely non-blocking and
 * fail-safe: it NEVER throws, and a slow/down CRM can never hang or break a form
 * (a short AbortController timeout bounds the request).
 */

export interface LeadPayload {
  name: string;
  email?: string;
  phone: string;
  /** Which website/domain the lead came from, e.g. "abhaglobaleducare.com". */
  source_platform: string;
  /** The form's existing `source` discriminator, e.g. "contact-page-form". */
  trigger_action?: string;
  /** Student's city/district — drives the CRM's district → office auto-routing. */
  city?: string;
  /** Any remaining form fields (course, neetScore, message, …). */
  extra_details?: Record<string, unknown>;
}

const CRM_TIMEOUT_MS = 4000;

/**
 * Send a lead to the CRM. NEVER throws — callers can `await` it safely.
 * Returns `true` only when the CRM confirmed receipt (HTTP 2xx); returns
 * `false` when the CRM is not configured, errored, or timed out, so callers
 * can detect a delivery failure and trace the lead instead of losing it.
 */
export async function sendLeadToCRM(lead: LeadPayload): Promise<boolean> {
  const url = process.env.CRM_INGEST_URL;
  const apiKey = process.env.CRM_API_KEY;

  if (!url || !apiKey) {
    console.warn(
      "[CRM] CRM_INGEST_URL or CRM_API_KEY not set — skipping CRM lead send.",
    );
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CRM_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source_platform: lead.source_platform,
        trigger_action: lead.trigger_action,
        city: lead.city,
        extra_details: lead.extra_details,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn(
        `[CRM] Lead ingest responded ${res.status} — lead not stored.`,
      );
      return false;
    }
    return true;
  } catch (error) {
    // Network error, timeout/abort, or anything else — swallow it. The form
    // submission and its email flow must continue unaffected.
    console.warn("[CRM] Lead ingest failed (non-blocking):", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
