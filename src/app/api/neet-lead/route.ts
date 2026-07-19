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

async function sendOfficeEmail(d: LeadData): Promise<void> {
  const { SMTP_USER, SMTP_PASSWORD, LEAD_NOTIFY_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASSWORD) return; // email not configured — skip silently
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: SMTP_USER,
      to: LEAD_NOTIFY_EMAIL || SMTP_USER,
      subject: `NEET Analyzer Lead — ${d.fullName} (${d.neetScore})`,
      html: officeEmailHtml(d),
    });
  } catch (e) {
    console.warn("[neet-lead] office email failed (non-blocking):", e);
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
    await Promise.allSettled([
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 500 });
  }
}
