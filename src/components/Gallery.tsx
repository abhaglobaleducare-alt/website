'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Play, Users, Camera, MessageSquare, Expand, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

/* ── Review data ─────────────────────────────────────────────── */
const reviews = [
  {
    id: 1,
    name: 'Hiren',
    course: 'MBBS Student — Tbilisi, Georgia',
    rating: 5,
    avatar: 'H',
    color: '#C6962E',
    text: '"Living in Tbilisi as a first-year was scary to think about. But ABHA arranged everything — from airport pickup to my room at Sterling hostel. The hostel is clean, safe, and full of Indian students so you never feel alone. Even after arriving, the team in Georgia is just a call away. They didn\'t disappear after taking the fees — which is rare."',
  },
  {
    id: 2,
    name: 'Varun',
    course: '1st Year MBBS — Alte University, Georgia',
    rating: 5,
    avatar: 'V',
    color: '#1B7C9E',
    text: '"Coming to Tbilisi alone was nerve-wracking, but Sterling hostel made it feel like home within days. Clean rooms, Indian meals, fast Wi-Fi — everything a student needs. ABHA arranged my airport pickup and I was settled in before I even realised I\'d landed in a new country. Couldn\'t have asked for a smoother start."',
  },
  {
    id: 3,
    name: 'Vrishabh',
    course: '2nd Year MBBS — European University, Georgia',
    rating: 5,
    avatar: 'V',
    color: '#C6962E',
    text: '"The best thing about Sterling is the community. You\'re surrounded by Indian students so there\'s zero culture shock. The location is safe, the warden is responsive, and the facilities are well-maintained. My parents were worried about me living abroad — one video call showing them the hostel and all their worries disappeared. ABHA really thought this through."',
  },
  {
    id: 4,
    name: 'Harshvardhan',
    course: '1st Year MBBS — SEU Georgia',
    rating: 5,
    avatar: 'H',
    color: '#1B7C9E',
    text: '"I was most stressed about food and accommodation before coming. Sterling hostel solved both. Ghar jaisa khana milta hai — seriously. The rooms are spacious, beds are comfortable, and the study area is quiet when you need to focus. ABHA bundled the hostel with admission so there was zero running around — everything came in one clean package."',
  },
  {
    id: 5,
    name: 'Vishwajeet',
    course: '3rd Year MBBS — East West University, Georgia',
    rating: 5,
    avatar: 'V',
    color: '#C6962E',
    text: '"I\'ve been at Sterling for 3 years now and it keeps getting better. The management actually listens to student feedback. Any issue — maintenance, internet, meals — gets resolved quickly. Living here has let me focus entirely on my studies without worrying about life logistics. ABHA running their own hostel is what separates them from every other consultancy."',
  },
  {
    id: 6,
    name: 'Hiren',
    course: '1st Year MBBS — Alte University, Georgia',
    rating: 5,
    avatar: 'H',
    color: '#1B7C9E',
    text: '"Honestly, I chose ABHA partly because of the hostel. Other consultancies just refer you somewhere random — ABHA has their own place in Tbilisi. When I arrived, the room was ready, bedding was there, and a senior student showed me around. That first day set the tone for everything — organised, warm, and genuinely caring. Very happy with this decision."',
  },
  {
    id: 7,
    name: 'Yashraj',
    course: 'Student — SEU Georgia',
    rating: 5,
    avatar: 'Y',
    color: '#C6962E',
    text: '"Before ABHA: confused, no idea which country or university, scared of scams. After ABHA: I\'m in my second year at SEU Georgia, loving every bit of it. The counsellor understood my NEET score and budget and gave honest options — not just the most expensive ones. They matched me to the right university, not just any university. That made all the difference."',
  },
  {
    id: 8,
    name: 'Sufiyan',
    course: 'Student — Avicenna University, Kyrgyzstan',
    rating: 5,
    avatar: 'S',
    color: '#1B7C9E',
    text: '"I applied late in the season and was worried I\'d miss enrollment. The ABHA team moved so fast — offer letter, visa documents, university registration, all done in under two weeks. Other consultancies had told me it would take 2 months minimum. ABHA made what felt impossible seem completely routine. Highly recommend to anyone serious about MBBS abroad."',
  },
  {
    id: 9,
    name: 'Shantanu',
    course: 'Student — Alte University, Georgia',
    rating: 5,
    avatar: 'S',
    color: '#C6962E',
    text: '"Before contacting ABHA I was completely lost — too many consultancies, too many confusing promises. The moment I spoke to the team, everything felt different. They explained every step clearly and never pushed me. And the documentation process was unbelievably fast — my offer letter and visa paperwork were sorted in days, not weeks. Didn\'t expect this level of efficiency from any consultancy."',
  },
  {
    id: 10,
    name: 'Nitika',
    course: 'Student — IEU, Kyrgyzstan',
    rating: 5,
    avatar: 'N',
    color: '#1B7C9E',
    text: '"So many consultancies just want to close the deal and move on. ABHA was different from the very first call — they were patient, answered every question, and never made me feel rushed. The entire documentation was handled so quickly and cleanly. By the time I landed in Bishkek, everything was already in place. Zero last-minute panic. Really grateful for this team."',
  },
  {
    id: 11,
    name: 'Shifa',
    course: 'Student — East West University, Georgia',
    rating: 5,
    avatar: 'S',
    color: '#C6962E',
    text: '"I had spoken to 4–5 consultancies before ABHA, and all of them were just trying to close the deal. ABHA was the only one that told me what to realistically expect — the good and the not-so-good. That honesty built my trust completely. From first call to landing in Georgia, they were with me every single step. If you\'re serious about MBBS abroad, start and end with ABHA."',
  },
];

/* ── Gallery categories ──────────────────────────────────────── */
const galleryItems = [
  {
    id: 1,
    category: 'hostel',
    label: 'Sterling Study & Stay Suites',
    bg: 'from-[#C6962E]/20 to-[#C6962E]/5',
    icon: '🏨',
    desc: 'Modern 200+ bed hostel in Tbilisi',
    image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F1%2520sterlingg%2520welcome.jpg',
  },
  { id: 10, category: 'hostel', label: 'Sterling 3-Share Room', bg: 'from-[#C6962E]/20 to-[#C6962E]/5', icon: '🛏️', desc: 'Comfortable shared student accommodation', image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F2%2520strling%25203%2520share.jpg' },
  { id: 11, category: 'hostel', label: 'Sterling Hostel Exterior', bg: 'from-[#C6962E]/20 to-[#C6962E]/5', icon: '🏢', desc: 'Sterling Study & Stay Suites building', image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F3%2520Sterling.jpg' },
  { id: 12, category: 'hostel', label: 'Sterling Bathrooms', bg: 'from-[#C6962E]/20 to-[#C6962E]/5', icon: '🚿', desc: 'Clean modern bathroom facilities', image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F5%2520sterling%2520bath.jpg' },
  { id: 13, category: 'hostel', label: 'Sterling Study Room', bg: 'from-[#C6962E]/20 to-[#C6962E]/5', icon: '📖', desc: 'Dedicated study room for students', image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F6%2520Sterling%2520Studyroom.jpg' },
  { id: 14, category: 'hostel', label: 'Sterling Gaming Room', bg: 'from-[#C6962E]/20 to-[#C6962E]/5', icon: '🎮', desc: 'Gaming & recreation lounge', image: '/api/blob-image?url=https%3A%2F%2Fsd0phdecfctmljdq.private.blob.vercel-storage.com%2F7%2520Sterling%2520gaming%2520room.jpg' },
];

const categories = ['all', 'hostel'];

/* ── Star rating ─────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-[#C6962E] text-[#C6962E]' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    if (lightbox) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox]);

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <div className="overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative bg-[#0B1A35] py-16 sm:py-20 lg:py-28 px-5 sm:px-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#C6962E 1px,transparent 1px),linear-gradient(90deg,#C6962E 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C6962E]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#1B7C9E]/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Gallery & Reviews
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-4xl sm:text-5xl lg:text-[3.25rem] text-white mb-6 leading-tight"
          >
            Life at ABHA —{' '}
            <span className="text-[#C6962E]">Through Our Students' Eyes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            Real photos, real testimonials — from students who chose ABHA Global Educare for their MBBS journey abroad.
          </motion.p>

        </div>
      </section>

      {/* ══════════════════════════════════════
          PHOTO GALLERY
      ══════════════════════════════════════ */}
      <section className="bg-[#F8F9FA] py-20 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              Photo Gallery
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-[#0B1A35]"
            >
              A Glimpse Into <span className="text-[#C6962E]">Student Life</span>
            </motion.h2>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#C6962E] to-[#DFB761] text-white shadow-lg shadow-[#C6962E]/30'
                    : 'bg-white text-[#0B1A35] border border-gray-200 hover:border-[#C6962E] hover:text-[#C6962E]'
                }`}
              >
                {cat === 'all' ? 'All Photos' : cat}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => {
                  if ('image' in item && item.image) {
                    setLightbox({ src: item.image as string, label: item.label });
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-400 ${'image' in item && item.image ? 'cursor-zoom-in' : 'cursor-default'}`}
              >
                {/* Image / placeholder area */}
                <div className="h-52 relative overflow-hidden">
                  {'image' in item && item.image ? (
                    <img
                      src={item.image as string}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`h-full bg-gradient-to-br ${item.bg} flex flex-col items-center justify-center`}>
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <div className="w-16 h-0.5 bg-[#C6962E]/30 rounded-full" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[#0B1A35]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      {'image' in item && item.image
                        ? <Expand size={20} className="text-white" />
                        : <Play size={20} className="text-white fill-white" />}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#0B1A35] text-sm mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                  <span className="inline-block mt-2 text-xs bg-[#C6962E]/10 text-[#C6962E] px-2.5 py-0.5 rounded-full capitalize font-medium">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming soon note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-gray-400 mt-8"
          >
            📸 Full photo gallery coming soon — follow us on{' '}
            <a
              href="https://www.instagram.com/abhaglobaleducare369"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C6962E] hover:underline font-medium"
            >
              @abhaglobaleducare369
            </a>{' '}
            for daily updates.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STUDENT REVIEWS
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              Student Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-[#0B1A35] mb-4"
            >
              What Our Students <span className="text-[#C6962E]">Say About Us</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 max-w-xl mx-auto"
            >
              Here are the latest student testimonials from ABHA Global Educare.
            </motion.p>
          </div>

          {/* Review grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#F8F9FA] rounded-2xl p-6 relative hover:shadow-lg transition-shadow duration-300"
              >
                <Quote
                  size={32}
                  className="absolute top-5 right-5 text-[#C6962E]/15"
                  strokeWidth={1}
                />
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: review.color }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0B1A35] text-sm">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.course}</div>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#C6962E] to-[#DFB761] py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl text-[#0B1A35] font-bold mb-4">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-[#0B1A35]/80 mb-8 text-lg">
            Join students who trusted ABHA Global Educare for their MBBS journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="bg-[#0B1A35] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#193769] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(11,26,53,0.4)]"
            >
              Book Free Counselling →
            </a>
            <a
              href="https://wa.me/917447552878"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0B1A35] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════ */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close preview"
            className="absolute top-5 right-5 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full p-2.5 transition-colors"
          >
            <X size={22} className="text-white" />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            src={lightbox.src}
            alt={lightbox.label}
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
            {lightbox.label}
          </div>
        </motion.div>
      )}

    </div>
  );
}
