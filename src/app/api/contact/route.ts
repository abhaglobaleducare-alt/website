import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { sendLeadToCRM } from "@/lib/crm";

// Validation schema for contact form
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  city: z.string().max(100).optional().or(z.literal("")),
  course: z.string().max(100).optional().or(z.literal("")),
  neetStatus: z.string().max(100).optional().or(z.literal("")),
  neetScore: z.string().max(20).optional().or(z.literal("")),
  preferredCountry: z.string().max(100).optional().or(z.literal("")),
  stream: z.string().max(120).optional().or(z.literal("")),
  university: z.string().max(160).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().max(50).optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Create reusable transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

// Build the admin notification email
function buildAdminEmail(data: ContactFormData): string {
  const fields = [
    { label: "Name", value: data.name },
    { label: "Phone", value: data.phone },
    { label: "Email", value: data.email },
    { label: "Stream", value: data.stream },
    { label: "University", value: data.university },
    { label: "City", value: data.city },
    { label: "Course", value: data.course },
    { label: "NEET Status", value: data.neetStatus },
    { label: "NEET Score", value: data.neetScore },
    { label: "Preferred Country", value: data.preferredCountry },
    { label: "Message", value: data.message },
    { label: "Form Source", value: data.source },
  ].filter((f) => f.value);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0B1A35, #1a3a5c); color: #fff; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 22px; color: #C6962E; }
        .header p { margin: 8px 0 0; font-size: 14px; color: #fff; opacity: 0.9; }
        .body { padding: 32px; }
        .field { margin-bottom: 16px; }
        .field-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .field-value { font-size: 16px; color: #333; font-weight: 500; }
        .footer { background: #f8f9fa; padding: 16px 32px; text-align: center; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Enquiry Received</h1>
          <p>A new student enquiry has been submitted on the website</p>
        </div>
        <div class="body">
          ${fields
            .map(
              (f) => `
            <div class="field">
              <div class="field-label">${f.label}</div>
              <div class="field-value">${f.value}</div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="footer">
          ABHA Global Educare LLP | ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </div>
      </div>
    </body>
    </html>
  `;
}

// Build the auto-reply email for the student — tailored by registration source
function buildAutoReplyEmail(name: string, source?: string): string {
  const isNeetPrep = source === "neet-preparation-registration";
  const isNeetHub = source === "neet-practice-hub-registration";

  const subject = isNeetPrep
    ? "NEET Preparation Portal"
    : isNeetHub
      ? "NEET Practice Hub"
      : "ABHA Global Educare";

  const bodyContent = isNeetPrep
    ? `
          <h2>Registration Received, ${name}!</h2>
          <p>Thank you for registering for the <strong>ABHA NEET Preparation Portal (₹999/year)</strong>.</p>
          <div class="highlight">
            <strong>What happens next?</strong>
            <ul>
              <li>Our team will verify your UPI payment (UTR) within 24 hours</li>
              <li>Your account will be activated and login credentials sent via WhatsApp &amp; Email</li>
              <li>You'll get full access to all 4 subjects — Physics, Chemistry, Botany &amp; Zoology</li>
            </ul>
          </div>
          <p>For faster activation, send your payment screenshot on WhatsApp:</p>
          <p>
            <strong>WhatsApp:</strong> <a href="https://wa.me/917447552878?text=Hi+I+just+registered+for+NEET+Preparation+Portal" style="color: #C6962E;">+91 74475 52878</a><br>
            <strong>Phone:</strong> +91 74475 52878<br>
            <strong>Email:</strong> abhaglobaleducare@gmail.com
          </p>`
    : isNeetHub
      ? `
          <h2>Registration Received, ${name}!</h2>
          <p>Thank you for registering for the <strong>ABHA NEET Practice Hub (₹1,111/year)</strong>.</p>
          <div class="highlight">
            <strong>What happens next?</strong>
            <ul>
              <li>Our team will verify your UPI payment (UTR) within 24 hours</li>
              <li>Your Practice Hub account will be activated and login credentials sent via WhatsApp &amp; Email</li>
              <li>You'll get access to Full NEET Mock Tests, Weekly Tests, Daily MCQs, and performance analytics</li>
            </ul>
          </div>
          <p>For faster activation, send your payment screenshot on WhatsApp:</p>
          <p>
            <strong>WhatsApp:</strong> <a href="https://wa.me/917447552878?text=Hi+I+just+registered+for+NEET+Practice+Hub" style="color: #C6962E;">+91 74475 52878</a><br>
            <strong>Phone:</strong> +91 74475 52878<br>
            <strong>Email:</strong> abhaglobaleducare@gmail.com
          </p>`
      : `
          <h2>Thank you, ${name}!</h2>
          <p>We have received your enquiry and our experienced counselor will contact you within <strong>24 hours</strong>.</p>
          <div class="highlight">
            <strong>What happens next?</strong>
            <ul>
              <li>Our counselor will review your profile</li>
              <li>We'll call you to discuss the best options</li>
              <li>You'll receive a personalized university recommendation</li>
            </ul>
          </div>
          <p>In the meantime, feel free to reach us at:</p>
          <p>
            <strong>Phone:</strong> +91 74475 52878<br>
            <strong>Email:</strong> abhaglobaleducare@gmail.com<br>
            <strong>WhatsApp:</strong> <a href="https://wa.me/917447552878" style="color: #C6962E;">Chat with us</a>
          </p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0B1A35, #1a3a5c); color: #fff; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #C6962E; }
        .header p { margin: 6px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); }
        .body { padding: 32px; color: #333; line-height: 1.6; }
        .body h2 { color: #0B1A35; }
        .highlight { background: #f0f7ff; border-left: 4px solid #C6962E; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; font-size: 12px; color: #999; }
        .footer a { color: #C6962E; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ABHA Global Educare</h1>
          <p>${subject}</p>
        </div>
        <div class="body">
          ${bodyContent}
          <p>Best regards,<br><strong>Team ABHA Global Educare</strong></p>
        </div>
        <div class="footer">
          <p>ABHA Global Educare LLP | <a href="https://abhaglobaleducare.com">abhaglobaleducare.com</a></p>
          <p>203, Lotus Plaza, Venus Corner, Shahupuri, Kolhapur - 416001, Maharashtra</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });

      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 },
      );
    }

    const data = result.data;

    // Build the CRM lead payload once. This is forwarded server-side on every
    // successful submission — it is fully non-blocking and never throws, so it
    // can never change the response the visitor receives.
    const extraDetails: Record<string, string> = {};
    for (const [key, value] of Object.entries({
      city: data.city,
      course: data.course,
      neetStatus: data.neetStatus,
      neetScore: data.neetScore,
      preferredCountry: data.preferredCountry,
      message: data.message,
    })) {
      if (value) extraDetails[key] = value;
    }
    const crmLead = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      // Which domain the lead came from (abhaglobaleducare.com vs abhaglobal.in).
      source_platform: request.headers.get("host") || "unknown",
      // The form's existing discriminator (contact-page-form, etc.).
      trigger_action: data.source || undefined,
      // Top-level city → the CRM auto-routes the lead to that district's office.
      city: data.city || undefined,
      extra_details: extraDetails,
    };

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // In development or when SMTP is not configured, just log the data
      console.log("[Contact Form] New enquiry received:", data);
      await sendLeadToCRM(crmLead).catch(() => {});
      return NextResponse.json({
        success: true,
        message: "Thank you! Our counselor will contact you within 24 hours.",
      });
    }

    // Send emails
    const transporter = createTransporter();

    // Stream-aware enquiries (from the course-page EnquiryModal) use a
    // structured subject; all other forms keep the legacy subject.
    const adminSubject =
      data.source === "enquiry-modal"
        ? `Website Enquiry — ${data.stream || "General"} — ${
            data.university || "Any / Not decided"
          } — ${data.name}`
        : `New Enquiry: ${data.name} — ${data.phone}`;

    // Send admin notification
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM || `"ABHA Website" <${process.env.SMTP_USER}>`,
      to:
        process.env.SMTP_TO ||
        "abhaglobaleducare@gmail.com, connect@abhaglobaleducare.com",
      subject: adminSubject,
      html: buildAdminEmail(data),
      replyTo: data.email || undefined,
    });

    // Send auto-reply to the student (only if email is provided)
    if (data.email) {
      const isNeetPrep = data.source === "neet-preparation-registration";
      const isNeetHub = data.source === "neet-practice-hub-registration";
      const replySubject = isNeetPrep
        ? "NEET Preparation Portal — Registration Received"
        : isNeetHub
          ? "NEET Practice Hub — Registration Received"
          : "Thank you for your enquiry — ABHA Global Educare";
      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"ABHA Global Educare" <${process.env.SMTP_USER}>`,
        to: data.email,
        subject: replySubject,
        html: buildAutoReplyEmail(data.name, data.source),
      });
    }

    // Forward to CRM after email has sent. Non-blocking and never throws — the
    // response below is unchanged whether the CRM succeeds, is slow, or is down.
    await sendLeadToCRM(crmLead).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Thank you! Our counselor will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("[Contact Form] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or call us directly.",
      },
      { status: 500 },
    );
  }
}
