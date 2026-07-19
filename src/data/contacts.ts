/**
 * ============================================================================
 * ABHA GLOBAL EDUCARE — CONTACT DETAILS · SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 * Every phone number, tel: link and WhatsApp link on the site MUST come from
 * this file. Do NOT hardcode a number, `tel:` or `wa.me` URL anywhere else.
 *
 * Business WhatsApp  → Kolhapur HO number (+91 74475 52878)
 * Boisar office phone → +91 72494 09376 (tel only, NOT WhatsApp)
 * Georgia office     → +995 579104926 (ABHA Global Services LLC, Tbilisi)
 * ============================================================================
 */

export interface OfficeContact {
  key: string;
  /** display label, e.g. "Kolhapur (Head Office)" */
  label: string;
  city: string;
  isHeadOffice?: boolean;
  companyName?: string;
  /** human display, e.g. "+91 74475 52878" */
  phoneDisplay: string;
  /** digits only, no +, for building wa.me/tel, e.g. "917447552878" */
  phoneRaw: string;
  /** ready-to-use tel: href, e.g. "tel:+917447552878" */
  tel: string;
  /** full one-line address */
  address: string;
  // schema.org PostalAddress fields
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
  mapUrl?: string;
  email?: string;
  hours: string;
}

export const OFFICE_HOURS_INDIA = 'Mon – Sat: 10:00 AM – 7:00 PM';

export const KOLHAPUR: OfficeContact = {
  key: 'kolhapur',
  label: 'Kolhapur (Head Office)',
  city: 'Kolhapur',
  isHeadOffice: true,
  phoneDisplay: '+91 74475 52878',
  phoneRaw: '917447552878',
  tel: 'tel:+917447552878',
  address: '203, Lotus Plaza, Venus Corner, Shahupuri, Kolhapur - 416001, Maharashtra, India',
  streetAddress: '203, Lotus Plaza, Venus Corner, Shahupuri',
  addressLocality: 'Kolhapur',
  addressRegion: 'Maharashtra',
  postalCode: '416001',
  addressCountry: 'IN',
  mapUrl: 'https://maps.google.com/?q=203,+Lotus+Plaza,+Venus+Corner,+Shahupuri,+Kolhapur',
  email: 'kolhapur@abhaglobaleducare.com',
  hours: OFFICE_HOURS_INDIA,
};

export const CSN: OfficeContact = {
  key: 'csn',
  label: 'Chhatrapati Sambhajinagar',
  city: 'Chhatrapati Sambhajinagar',
  phoneDisplay: '+91 76207 07088',
  phoneRaw: '917620707088',
  tel: 'tel:+917620707088',
  address: 'Office No. 01, Plot No. B-1, Aliza Mazil, Osmanpura, Chhatrapati Sambhajinagar, Maharashtra, India',
  streetAddress: 'Office No. 01, Plot No. B-1, Aliza Mazil, Osmanpura',
  addressLocality: 'Chhatrapati Sambhajinagar',
  addressRegion: 'Maharashtra',
  addressCountry: 'IN',
  mapUrl: 'https://maps.google.com/?q=Aliza+Mazil,+Osmanpura,+Chhatrapati+Sambhajinagar',
  email: 'csn@abhaglobaleducare.com',
  hours: OFFICE_HOURS_INDIA,
};

export const BOISAR: OfficeContact = {
  key: 'boisar',
  label: 'Boisar',
  city: 'Boisar',
  phoneDisplay: '+91 72494 09376',
  phoneRaw: '917249409376',
  tel: 'tel:+917249409376',
  address: 'Mahavir Nischay A-6, Flat 201, Mahavir Nagar, Boisar - 401501, Maharashtra, India',
  streetAddress: 'Mahavir Nischay A-6, Flat 201, Mahavir Nagar',
  addressLocality: 'Boisar',
  addressRegion: 'Maharashtra',
  postalCode: '401501',
  addressCountry: 'IN',
  mapUrl: 'https://maps.google.com/?q=Mahavir+Nagar,+Boisar',
  hours: OFFICE_HOURS_INDIA,
};

export const GEORGIA_OFFICE: OfficeContact = {
  key: 'georgia',
  label: 'Georgia (Tbilisi)',
  city: 'Tbilisi',
  companyName: 'ABHA Global Services LLC',
  phoneDisplay: '+995 579104926',
  phoneRaw: '995579104926',
  tel: 'tel:+995579104926',
  address: '37 Raphael Agladze Street, Tbilisi, Georgia',
  streetAddress: '37 Raphael Agladze Street',
  addressLocality: 'Tbilisi',
  addressCountry: 'GE',
  mapUrl: 'https://maps.google.com/?q=37+Raphael+Agladze+Street,+Tbilisi,+Georgia',
  email: 'georgia@abhaglobaleducare.com',
  hours: 'Mon – Fri: 10:00 AM – 6:00 PM (Georgia Time)',
};

/** Ordered India offices for footer/contact listings. */
export const INDIA_OFFICES: OfficeContact[] = [KOLHAPUR, CSN, BOISAR];
export const ALL_OFFICES: OfficeContact[] = [KOLHAPUR, CSN, BOISAR, GEORGIA_OFFICE];

/** Primary business WhatsApp — Kolhapur HO number. */
export const WHATSAPP = {
  phoneRaw: '917447552878',
  display: '+91 74475 52878',
  link: 'https://wa.me/917447552878',
} as const;

/** Build a WhatsApp link from a plain (unencoded) message. */
export function waLink(text?: string): string {
  return text ? `${WHATSAPP.link}?text=${encodeURIComponent(text)}` : WHATSAPP.link;
}

/** Build a WhatsApp link from an ALREADY URL-encoded query string (preserves exact encoding). */
export function waLinkEncoded(encoded?: string): string {
  return encoded ? `${WHATSAPP.link}?text=${encoded}` : WHATSAPP.link;
}

export const CONTACT_EMAIL = 'connect@abhaglobaleducare.com';

/** Trust line for Georgia / abroad pages. */
export const GEORGIA_SUPPORT_LINE = `On-ground support: ${GEORGIA_OFFICE.companyName}, Tbilisi · ${GEORGIA_OFFICE.phoneDisplay}`;
