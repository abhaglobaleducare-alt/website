'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'AGDRP म्हणजे काय?',
    a: 'AGDRP — ABHA Global Doctor Readiness Program. हा ABHA चा एकत्रित कार्यक्रम आहे ज्यात Hands-On Clinical Workshops, MBBS Coaching Portal आणि INCREDOC Digital Workspace यांचा समावेश आहे. उद्देश एकच — फक्त प्रवेश नाही, तर डॉक्टर बनवण्याची संपूर्ण तयारी.',
  },
  {
    q: 'Coaching चा वेगळा खर्च आहे का?',
    a: 'नाही. MBBS Coaching Portal हे ABHA package मध्येच included आहे — त्यासाठी वेगळी fee नाही. संपूर्ण AGDRP (workshops + coaching + digital workspace) कोणत्याही अतिरिक्त शुल्काशिवाय मिळतं.',
  },
  {
    q: 'FMGE ची तयारी होते का?',
    a: 'होय. Coaching Portal मध्ये संपूर्ण FMGE syllabus coverage आहे — सर्व 5 वर्षांसाठी Notes, Test Series आणि Doubt Solving, ABHA च्या स्वतःच्या MBBS-qualified faculty कडून. Hands-on workshops देखील practical skills द्वारे तयारीला आधार देतात.',
  },
  {
    q: 'Workshops कुठे होतात?',
    a: 'Workshops ABHA × Praxis च्या clinical training setup मध्ये होतात — प्रत्येक विद्यार्थ्याला एक organ specimen, expert faculty च्या देखरेखीखाली. आतापर्यंत 10 Clinical Workshops आयोजित केले आहेत.',
  },
  {
    q: 'Hostel कसं आहे?',
    a: 'Tbilisi (Georgia) मध्ये ABHA चं स्वतःचं hostel आहे, सोबत Indian mess — त्यामुळे राहण्याची आणि जेवणाची घरच्यासारखी व्यवस्था. ABHA चे 4 offices आहेत: Kolhapur, Chhatrapati Sambhajinagar, Boisar आणि Tbilisi.',
  },
  {
    q: 'NEET score किती लागतो?',
    a: 'MBBS abroad साठी NEET qualifying आवश्यक आहे. तुमचा नेमका score आणि पर्याय समजून घेण्यासाठी आमच्या counsellor शी बोला — फॉर्म भरा, आम्ही 24 तासांच्या आत तुमच्याशी संपर्क करू.',
  },
];

export default function ApplyFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[760px] space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="font-semibold text-[#0B1A35]">{item.q}</span>
              <ChevronDown
                size={20}
                className={`flex-shrink-0 text-[#C6962E] transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-gray-600 sm:px-6">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
