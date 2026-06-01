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
  /** Any remaining form fields (city, course, neetScore, message, …). */
  extra_details?: Record<string, unknown>;
}

const CRM_TIMEOUT_MS = 4000;

/**
 * Send a lead to the CRM. Resolves silently on success OR failure — callers can
 * `await` it without any risk of it throwing or altering their response.
 */
export async function sendLeadToCRM(lead: LeadPayload): Promise<void> {
  const url = process.env.CRM_INGEST_URL;
  const apiKey = process.env.CRM_API_KEY;

  if (!url || !apiKey) {
    console.warn(
      "[CRM] CRM_INGEST_URL or CRM_API_KEY not set — skipping CRM lead send.",
    );
    return;
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
        extra_details: lead.extra_details,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn(
        `[CRM] Lead ingest responded ${res.status} — lead not stored.`,
      );
    }
  } catch (error) {
    // Network error, timeout/abort, or anything else — swallow it. The form
    // submission and its email flow must continue unaffected.
    console.warn("[CRM] Lead ingest failed (non-blocking):", error);
  } finally {
    clearTimeout(timeout);
  }
}
