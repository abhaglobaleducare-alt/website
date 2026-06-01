"use client";

import {
  Children,
  cloneElement,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

const FLAG_KEY = "abha_lead_captured";
const DATA_KEY = "abha_lead";

type Mode = "newTab" | "sameTab";

interface StoredLead {
  name: string;
  email: string;
  phone: string;
}

interface LeadGateProps {
  /** The CRM trigger_action for this CTA, e.g. "whatsapp_appointment". */
  action: string;
  /** newTab => window.open; sameTab => window.location.assign. */
  mode: Mode;
  /** Optional extra_details forwarded to the CRM. */
  extra?: Record<string, unknown>;
  /** Exactly one anchor/Link element — rendered unchanged. */
  children: ReactElement<{
    href?: string;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  }>;
}

/** Perform the original CTA action, synchronously, inside the click gesture. */
function performAction(href: string, mode: Mode) {
  if (mode === "newTab") {
    const opened = window.open(href, "_blank", "noopener,noreferrer");
    // Popup blocked despite the gesture: fall back to same-tab navigation.
    if (!opened) window.location.href = href;
  } else {
    window.location.assign(href);
  }
}

/** Fire-and-forget CRM POST. keepalive lets it finish after we navigate. */
function postLead(payload: Record<string, unknown>) {
  try {
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let lead logging affect the user's action */
  }
}

export default function LeadGate({
  action,
  mode,
  extra,
  children,
}: LeadGateProps) {
  const child = Children.only(children);
  const href = child.props.href ?? "#";

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.length >= 10 && phoneDigits.length <= 15;
  const valid = nameOk && emailOk && phoneOk;

  function handleClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    // Repeat visitor: skip the modal, silently re-send with stored identity.
    let stored: StoredLead | null = null;
    try {
      if (localStorage.getItem(FLAG_KEY) === "1") {
        const raw = localStorage.getItem(DATA_KEY);
        stored = raw ? (JSON.parse(raw) as StoredLead) : null;
      }
    } catch {
      stored = null;
    }

    if (stored && stored.email && stored.phone) {
      postLead({ ...stored, trigger_action: action, extra_details: extra });
      performAction(href, mode);
      return;
    }

    setOpen(true);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) return;

    const lead: StoredLead = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      localStorage.setItem(FLAG_KEY, "1");
      localStorage.setItem(DATA_KEY, JSON.stringify(lead));
    } catch {
      /* private mode / storage disabled — proceed anyway */
    }

    setOpen(false);
    // Fire the CRM POST, then perform the action synchronously in this gesture.
    postLead({ ...lead, trigger_action: action, extra_details: extra });
    performAction(href, mode);
  }

  const trigger = cloneElement(child, { onClick: handleClick });

  return (
    <>
      {trigger}

      <AnimatePresence>
        {open && (
          <Dialog
            static
            open={open}
            onClose={() => setOpen(false)}
            className="relative z-[100]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel className="relative w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full rounded-2xl bg-white p-7 shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>

                  <DialogTitle className="font-playfair text-2xl font-bold text-[#0B1A35]">
                    Just one quick step
                  </DialogTitle>
                  <p className="mt-1.5 mb-5 text-sm text-gray-500">
                    Share your details and our team will personally follow up.
                    Then we&apos;ll take you straight there.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="name"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0B1A35] outline-none transition-colors focus:border-[#C6962E]"
                    />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0B1A35] outline-none transition-colors focus:border-[#C6962E]"
                    />
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0B1A35] outline-none transition-colors focus:border-[#C6962E]"
                    />

                    <button
                      type="submit"
                      disabled={!valid}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C6962E] px-6 py-3.5 font-bold text-[#0B1A35] transition-all hover:bg-[#d4a73a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </form>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <ShieldCheck size={13} />
                    We respect your privacy. No spam — just helpful guidance.
                  </p>
                </motion.div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
