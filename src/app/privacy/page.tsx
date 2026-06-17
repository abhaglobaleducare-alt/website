import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for ABHA Global Educare LLP — how we collect, use, and protect the personal information you share with us for NEET preparation and MBBS-abroad counselling.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'June 17, 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-white">
        {/* Hero */}
        <section className="bg-[#0B1A35] pt-28 pb-14 text-white sm:pt-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#C6962E]">
              Legal
            </p>
            <h1 className="mt-3 font-playfair text-4xl font-bold sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-white/60">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-14 sm:py-16">
          <div className="prose-headings:font-playfair mx-auto max-w-4xl px-4 text-primary-navy sm:px-6 lg:px-8">
            <p className="text-lg leading-relaxed text-primary-navy/80">
              ABHA Global Educare LLP (&ldquo;ABHA Global Educare,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is an
              education consultancy that provides NEET preparation and
              MBBS-abroad admission counselling to students and their families.
              We respect your privacy and are committed to protecting the
              personal information you share with us. This Privacy Policy
              explains what information we collect, how we use it, and the
              choices you have.
            </p>

            <Section title="1. Information We Collect">
              <p>
                We collect information that you voluntarily provide to us when
                you fill out an enquiry or counselling form on our website,
                message us on WhatsApp, call us, email us, or otherwise reach
                out for our services. This may include:
              </p>
              <ul>
                <li>
                  <strong>Contact details</strong> — your name, phone number,
                  WhatsApp number, and email address.
                </li>
                <li>
                  <strong>Academic details</strong> — information you choose to
                  share for counselling, such as your NEET status or score,
                  qualifying examination details, and course or country
                  preferences.
                </li>
                <li>
                  <strong>Communication content</strong> — the messages,
                  questions, and documents you send us while we assist you.
                </li>
                <li>
                  <strong>Basic technical data</strong> — limited analytics
                  information (such as pages visited) collected automatically to
                  help us improve the website.
                </li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information you provide to:</p>
              <ul>
                <li>
                  Provide NEET preparation guidance and MBBS-abroad admission
                  counselling.
                </li>
                <li>
                  Respond to your enquiries and communicate with you about our
                  services — including by phone, email, SMS, and WhatsApp.
                </li>
                <li>
                  Assist with university shortlisting, applications, admissions,
                  and related documentation.
                </li>
                <li>
                  Send you relevant updates about programs, scholarships,
                  workshops, and important deadlines you have enquired about.
                </li>
                <li>
                  Improve our website, services, and the overall quality of our
                  counselling.
                </li>
              </ul>
            </Section>

            <Section title="3. WhatsApp Communication">
              <p>
                When you contact us through WhatsApp, your phone number and the
                content of your messages are used solely to respond to you and
                to provide the counselling and admission support you have
                requested. We use WhatsApp as a communication channel and do not
                send unsolicited promotional messages to people who have not
                reached out to us or requested our services.
              </p>
            </Section>

            <Section title="4. We Do Not Sell Your Data">
              <p>
                We do <strong>not</strong> sell, rent, or trade your personal
                information to third parties. We share your information only
                where it is necessary to deliver our services — for example,
                with partner universities or institutions you are applying to,
                or with trusted service providers (such as email and hosting
                providers) who help us operate our website and communicate with
                you. These parties are permitted to use your information only to
                perform services on our behalf. We may also disclose information
                where required by law.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain your personal information for as long as needed to
                provide our counselling and admission services and to maintain
                our records, after which it is deleted or anonymised. You may
                ask us to delete your information at any time, subject to any
                legal obligations we may have to retain it.
              </p>
            </Section>

            <Section title="6. Data Security">
              <p>
                We take reasonable technical and organisational measures to
                protect your personal information against unauthorised access,
                loss, or misuse. While no method of transmission or storage is
                completely secure, we work to safeguard the information you
                entrust to us.
              </p>
            </Section>

            <Section title="7. Your Rights and Choices">
              <p>
                You may request to access, correct, or delete the personal
                information we hold about you, and you may opt out of receiving
                non-essential communications from us at any time. To exercise
                any of these rights, contact us using the details below.
              </p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                Our services are intended for prospective and current students,
                typically of college-going age, and their families. We do not
                knowingly collect information from children without the
                involvement of a parent or guardian. If you believe a child has
                provided us information without appropriate consent, please
                contact us and we will take steps to remove it.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do,
                we will revise the &ldquo;Last updated&rdquo; date at the top of
                this page. We encourage you to review this page periodically.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or how your
                information is handled, please contact us:
              </p>
              <ul>
                <li>
                  <strong>ABHA Global Educare LLP</strong>
                </li>
                <li>
                  Email:{' '}
                  <a
                    href="mailto:connect@abhaglobaleducare.com"
                    className="font-semibold text-[#C6962E] hover:underline"
                  >
                    connect@abhaglobaleducare.com
                  </a>
                </li>
                <li>
                  Head Office: 203, Lotus Plaza, Venus Corner, Shahupuri,
                  Kolhapur, Maharashtra 416001, India
                </li>
              </ul>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-playfair text-2xl font-bold text-primary-navy">
        {title}
      </h2>
      <div className="mt-3 space-y-4 leading-relaxed text-primary-navy/80 [&_a]:break-words [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
