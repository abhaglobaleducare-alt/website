import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadToCRM } from "@/lib/crm";

// Validation for the lead-gate popup payload (Name + Email + Phone + context).
const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  trigger_action: z.string().max(60).optional().or(z.literal("")),
  extra_details: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed" },
        { status: 400 },
      );
    }

    const data = result.data;

    // Forward to the CRM server-side. sendLeadToCRM never throws and is bounded
    // by its own timeout, so this can never hang or error the response.
    await sendLeadToCRM({
      name: data.name,
      email: data.email,
      phone: data.phone,
      // Which domain the lead came from (abhaglobaleducare.com vs abhaglobal.in).
      source_platform: request.headers.get("host") || "unknown",
      trigger_action: data.trigger_action || undefined,
      extra_details: data.extra_details,
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    // Even on unexpected errors, respond cleanly — the client fires this
    // fire-and-forget and never blocks the user's action on it.
    return NextResponse.json(
      { ok: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
