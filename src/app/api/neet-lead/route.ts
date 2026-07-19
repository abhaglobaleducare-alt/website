import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { sendLeadToCRM } from "@/lib/crm";

/**
 * NEET Analyzer lead ingest. Forwards the rich registration payload to the CRM
 * (structured extra_details) AND emails the office. Fire-and-forget & fail-safe:
 * a CRM/SMTP outage never blocks the student's unlock.
 */
const leadSchema = z.object({
  fullName: z.string().min(2).max(100),
  parentName: z.string().max(100).optional().or(z.literal("")),
  mobile: z.string().min(10).max(15).regex(/^[\d\s\-+()]+$/),
  whatsapp: z.string().max(15).optional().or(z.literal("")),
  email: z.string().email(),
  city: z.string().min(1).max(100),
  state: z.string().max(60).optional().or(z.literal("")),
  neetScore: z.coerce.number().min(-180).max(720),
  allIndiaRank: z.coerce.number().optional(),
  category: z.string().max(20).optional().or(z.literal("")),
  currentStatus: z.string().max(80).optional().or(z.literal("")),
  interestedIn: z.array(z.string().max(80)).max(30).optional().default([]),
  preferredCountry: z.string().max(100).optional().or(z.literal("")),
  otherCourse: z.string().max(100).optional().or(z.literal("")),
  budgetRange: z.string().max(60).optional().or(z.literal("")),
  consentGiven: z.literal(true),
  ipadOfferInterested: z.boolean().optional().default(false),
  // computed analysis snapshot
  estimatedRank: z.coerce.number().optional(),
  governmentChance: z.string().max(40).optional().or(z.literal("")),
  stateQuotaChance: z.string().max(40).optional().or(z.literal("")),
  privateChance: z.string().max(40).optional().or(z.literal("")),
  abroadRecommended: z.boolean().optional().default(false),
  topRecommendation: z.string().max(160).optional().or(z.literal("")),
  utmSource: z.string().max(120).optional().or(z.literal("")),
  utmMedium: z.string().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().max(120).optional().or(z.literal("")),
});

type LeadData = z.infer<typeof leadSchema>;

function officeEmailHtml(d: LeadData): string {
  const rows = [
    ["Name", d.fullName],
    ["Parent/Guardian", d.parentName],
    ["Mobile", d.mobile],
    ["WhatsApp", d.whatsapp || d.mobile],
    ["Email", d.email],
    ["City", d.city],
    ["State", d.state],
    ["NEET Score", String(d.neetScore)],
    ["All India Rank", d.allIndiaRank ? String(d.allIndiaRank) : "—"],
    ["Estimated Rank", d.estimatedRank ? String(d.estimatedRank) : "—"],
    ["Category", d.category],
    ["Current Status", d.currentStatus],
    ["Interested In", (d.interestedIn || []).join(", ")],
    ["Preferred Country", d.preferredCountry],
    ["Other Course", d.otherCourse],
    ["Budget Range", d.budgetRange],
    ["iPad Offer Interested", d.ipadOfferInterested ? "Yes" : "No"],
    ["Govt Chance", d.governmentChance],
    ["State Quota Chance", d.stateQuotaChance],
    ["Private Chance", d.privateChance],
    ["Abroad Recommended", d.abroadRecommended ? "Yes" : "No"],
    ["Top Recommendation", d.topRecommendation],
    ["UTM", [d.utmSource, d.utmMedium, d.utmCampaign].filter(Boolean).join(" / ")],
  ].filter(([, v]) => v);

  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0B1A35">
    <h2 style="color:#C6962E">🎯 New NEET Analyzer Lead</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="font-weight:bold;border-bottom:1px solid #eee">${k}</td><td style="border-bottom:1px solid #eee">${v}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="color:#888;font-size:12px">Source: neet-analyzer · This lead completed the registration wall to unlock full results.</p>
  </body></html>`;
}

/** Returns true only if the office email was actually sent. Never throws. */
async function sendOfficeEmail(d: LeadData): Promise<boolean> {
  const { SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_USER || !SMTP_PASSWORD) return false; // email not configured — skip
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"ABHA Website" <${SMTP_USER}>`,
      // Reuse the site-wide notify list (comma-separated) used by the contact form.
      to: process.env.SMTP_TO || "abhaglobaleducare@gmail.com, connect@abhaglobaleducare.com",
      subject: `NEET Analyzer Lead — ${d.fullName} (${d.neetScore})`,
      html: officeEmailHtml(d),
    });
    return true;
  } catch (e) {
    console.warn("[neet-lead] office email failed (non-blocking):", e);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ ok: false, message: "Validation failed" }, { status: 400 });
    }
    const d = result.data;

    // Forward to CRM (structured) and email the office — both non-blocking.
    const [crmResult, emailResult] = await Promise.allSettled([
      sendLeadToCRM({
        name: d.fullName,
        email: d.email,
        phone: d.mobile,
        source_platform: request.headers.get("host") || "unknown",
        trigger_action: "neet-analyzer",
        city: d.city,
        extra_details: {
          parentName: d.parentName,
          whatsapp: d.whatsapp || d.mobile,
          state: d.state,
          neetScore: d.neetScore,
          allIndiaRank: d.allIndiaRank ?? null,
          category: d.category,
          currentStatus: d.currentStatus,
          interestedIn: d.interestedIn,
          preferredCountry: d.preferredCountry,
          otherCourse: d.otherCourse,
          budgetRange: d.budgetRange,
          consentGiven: d.consentGiven,
          ipadOfferInterested: d.ipadOfferInterested,
          estimatedRank: d.estimatedRank ?? null,
          governmentChance: d.governmentChance,
          stateQuotaChance: d.stateQuotaChance,
          privateChance: d.privateChance,
          abroadRecommended: d.abroadRecommended,
          topRecommendation: d.topRecommendation,
          source: "neet-analyzer",
          followUpStatus: "new",
          roadmapSent: false,
          utmSource: d.utmSource,
          utmMedium: d.utmMedium,
          utmCampaign: d.utmCampaign,
        },
      }),
      sendOfficeEmail(d),
    ]);

    const crmOk = crmResult.status === "fulfilled" && crmResult.value === true;
    const emailOk = emailResult.status === "fulfilled" && emailResult.value === true;
    const delivered = crmOk || emailOk;

    // A dropped lead is lost revenue. If NEITHER channel confirmed delivery,
    // dump the full lead to the server logs (Vercel → Logs) so it is never
    // silently lost, and tell the client so it can fire `lead_delivery_failed`.
    if (!delivered) {
      console.error(
        "[neet-lead] DELIVERY FAILED — lead not stored in CRM or emailed. Full lead below so it is never lost:",
        JSON.stringify({
          ...d,
          _crmConfigured: Boolean(process.env.CRM_INGEST_URL && process.env.CRM_API_KEY),
          _smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
          _receivedAt: new Date().toISOString(),
        }),
      );
    }

    // Always ok:true — the student unlocks regardless. `delivered` is the trace flag.
    return NextResponse.json({ ok: true, delivered, crmOk, emailOk });
  } catch (err) {
    // Unexpected server error AFTER we have the body — still trace what we can.
    console.error("[neet-lead] unexpected error — lead may be lost:", err);
    return NextResponse.json({ ok: false, delivered: false, message: "Something went wrong." }, { status: 500 });
  }
}
