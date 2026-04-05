'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Play, Users, Camera, MessageSquare, Expand, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

/* ── Review data ─────────────────────────────────────────────── */
const reviews = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    course: 'MBBS – Georgia (2023)',
    rating: 5,
    avatar: 'PS',
    color: '#C6962E',
    text: 'ABHA Global made my dream of becoming a doctor a reality. From the visa process to settling in Tbilisi, they supported me at every step. The Sterling Study & Stay Suites felt like home — Indian food, friendly staff, and 24/7 support. Cleared FMGE in 1st attempt!',
  },
  {
    id: 2,
    name: 'Rahul Desai',
    course: 'MBBS – Kyrgyzstan (2022)',
    rating: 5,
    avatar: 'RD',
    color: '#1B7C9E',
    text: 'I was confused about MBBS abroad until ABHA\'s counsellors explained everything clearly — NMC guidelines, cost breakdown, hostel facilities. Choosing Kyrgyzstan was the best decision. The managed hostel and Indian mess saved me thousands. Highly recommend!',
  },
  {
    id: 3,
    name: 'Anjali Patil',
    course: 'MBBS – Georgia (2024)',
    rating: 5,
    avatar: 'AP',
    color: '#C6962E',
    text: 'The Clinical Workshops by ABHA were a game-changer for my FMGE prep. Hands-on cadaver sessions and actual clinical exposure that no coaching center offers. The ABHA team in Tbilisi is always reachable — they genuinely care about students.',
  },
  {
    id: 4,
    name: 'Siddharth Nair',
    course: 'MBBS – Georgia (2023)',
    rating: 5,
    avatar: 'SN',
    color: '#1B7C9E',
    text: 'I was nervous about moving abroad at 18, but ABHA\'s pre-departure orientation prepared me mentally and practically. The accommodation is amazing — clean rooms, gym, study hall, and home-cooked meals. My parents were relieved seeing how well looked after I am.',
  },
  {
    id: 5,
    name: 'Meera Joshi',
    course: 'MBBS – Kyrgyzstan (2022)',
    rating: 5,
    avatar: 'MJ',
    color: '#C6962E',
    text: 'ABHA helped with everything — NEET counselling, university selection, documentation, visa, airport pickup, and even setting up my bank account in Bishkek. I never felt alone. The IEU university has great faculty and ABHA\'s ground team is always there.',
  },
  {
    id: 6,
    name: 'Arjun Verma',
    course: 'MBBS – Georgia (2024)',
    rating: 5,
    avatar: 'AV',
    color: '#1B7C9E',
    text: 'Can\'t recommend ABHA enough. Got the AGEST scholarship which saved me $6,000! The counselling sessions helped me understand exactly what FMGE requires and how Georgian universities align with it. Best investment for my medical career.',
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

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-14"
          >
            {[
              { icon: Users, value: '500+', label: 'Students Sent' },
              { icon: Star, value: '4.9/5', label: 'Average Rating' },
              { icon: Camera, value: '200+', label: 'Gallery Photos' },
              { icon: MessageSquare, value: '300+', label: 'Written Reviews' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="mx-auto mb-1.5 text-[#C6962E]" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>
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
              href="https://www.instagram.com/abhaglobaleducare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C6962E] hover:underline font-medium"
            >
              @abhaglobaleducare
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
              Over 500 students have trusted ABHA Global Educare. Here&apos;s what some of them have to say.
            </motion.p>
          </div>

          {/* Overall rating bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#0B1A35] to-[#193769] rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center justify-around gap-6 text-center"
          >
            <div>
              <div className="text-6xl font-bold text-[#C6962E] mb-1">4.9</div>
              <div className="flex justify-center mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-[#C6962E] text-[#C6962E]" />
                ))}
              </div>
              <div className="text-white/60 text-sm">Overall Rating</div>
            </div>
            <div className="hidden sm:block w-px h-20 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white mb-1">300+</div>
              <div className="text-white/60 text-sm">Verified Reviews</div>
            </div>
            <div className="hidden sm:block w-px h-20 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white mb-1">98%</div>
              <div className="text-white/60 text-sm">Would Recommend</div>
            </div>
            <div className="hidden sm:block w-px h-20 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-white/60 text-sm">Students Enrolled</div>
            </div>
          </motion.div>

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
            Join 500+ students who trusted ABHA Global Educare for their MBBS journey.
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
