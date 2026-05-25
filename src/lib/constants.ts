/**
 * ABHA Global Educare - Site Constants
 */

export const SITE_CONFIG = {
  name: 'ABHA Global Educare LLP',
  shortName: 'ABHA Educare',
  tagline: 'Dreams Have No Borders',
  description:
    'ABHA Global Educare LLP — premier MBBS abroad consultancy for Indian students. NMC & WHO Eligible universities in Georgia, Russia, Kazakhstan & Kyrgyzstan. NEET preparation portal, full mock tests, and Bapusaheb Patil (Sagaon) Abroad Education Support Grant. Office in Kolhapur, Maharashtra.',
  url: 'https://abhaglobaleducare.com',
  email: 'connect@abhaglobaleducare.com',
  logo: '/images/logo.png',
  ogImage: '/images/og-image.jpg',
};

export const COMPANY_INFO = {
  name: 'ABHA Global Educare LLP',
  llpNumber: 'ACO-8092',
  foundedYear: 2020,
  registeredAddress: '203, Lotus Plaza, Venus Corner, Shahupuri, Kolhapur - 416001, Maharashtra, India',
};

export const CONTACT_INFO = {
  kolhapur: {
    label: 'Kolhapur Office (Head Office)',
    address: '203, Lotus Plaza, Venus Corner, Shahupuri, Kolhapur - 416001, Maharashtra, India',
    phone: '+91 74475 52878',
    phoneRaw: '+917447552878',
    email: 'kolhapur@abhaglobaleducare.com',
    mapUrl: 'https://maps.google.com/?q=203,+Lotus+Plaza,+Venus+Corner,+Shahupuri,+Kolhapur',
    timings: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  csn: {
    label: 'Chatrapati Sambhajinagar Office',
    address: 'Office No. 01, Plot No. B-1, Aliza Mazil, Osmanpura, Chatrapati Sambhajinagar, Maharashtra, India',
    phone: '+91 76207 07088',
    phoneRaw: '+917620707088',
    email: 'csn@abhaglobaleducare.com',
    mapUrl: 'https://maps.google.com/?q=Aliza+Mazil,+Osmanpura,+Chatrapati+Sambhajinagar',
    timings: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  georgia: {
    label: 'Georgia Office (International)',
    companyName: 'ABHA Global Services LLC',
    address: '37 Raphael Agladze Street, Tbilisi, Georgia',
    phone: '+995 591 717122',
    phoneRaw: '+995591717122',
    email: 'georgia@abhaglobaleducare.com',
    mapUrl: 'https://maps.google.com/?q=37+Raphael+Agladze+Street,+Tbilisi,+Georgia',
    timings: 'Mon - Fri: 10:00 AM - 6:00 PM (Georgia Time)',
  },
};

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/abhaglobaleducare',
  instagram: 'https://instagram.com/abhaglobaleducare',
  linkedin: 'https://linkedin.com/company/abhaglobaleducare',
  youtube: 'https://youtube.com/@abhaglobaleducare',
  twitter: 'https://twitter.com/abhaeducare',
  whatsapp: 'https://wa.me/917447552878',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Destinations',
    href: '/destinations',
    children: [
      { label: 'Russia', href: '/destinations/russia' },
      { label: 'Georgia', href: '/destinations/georgia' },
      { label: 'Kazakhstan', href: '/destinations/kazakhstan' },
      { label: 'Kyrgyzstan', href: '/destinations/kyrgyzstan' },
      { label: 'Philippines', href: '/destinations/philippines' },
      { label: 'Bangladesh', href: '/destinations/bangladesh' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'University Selection', href: '/services/university-selection' },
      { label: 'Admission Guidance', href: '/services/admission-guidance' },
      { label: 'Visa Assistance', href: '/services/visa-assistance' },
      { label: 'Travel & Accommodation', href: '/services/travel-accommodation' },
      { label: 'Post-Arrival Support', href: '/services/post-arrival-support' },
    ],
  },
  { label: 'Universities', href: '/universities' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Universities', href: '/universities' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
  ],
  destinations: [
    { label: 'MBBS in Russia', href: '/destinations/russia' },
    { label: 'MBBS in Georgia', href: '/destinations/georgia' },
    { label: 'MBBS in Kazakhstan', href: '/destinations/kazakhstan' },
    { label: 'MBBS in Kyrgyzstan', href: '/destinations/kyrgyzstan' },
    { label: 'MBBS in Philippines', href: '/destinations/philippines' },
    { label: 'MBBS in Bangladesh', href: '/destinations/bangladesh' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

export const DESTINATIONS = [
  {
    id: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    image: '/images/destinations/russia.jpg',
    universities: 50,
    duration: '6 years',
    fees: '₹25-35 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'Top-ranked medical universities',
      'English medium programs',
      'NMC & WHO Eligible universities',
      'Rich cultural experience',
    ],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    flag: '🇬🇪',
    image: '/images/destinations/georgia.jpg',
    universities: 10,
    duration: '6 years',
    fees: '₹30-40 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'European standard education',
      'Safe and friendly environment',
      'Affordable living costs',
      'No entrance exam required',
    ],
  },
  {
    id: 'kazakhstan',
    name: 'Kazakhstan',
    flag: '🇰🇿',
    image: '/images/destinations/kazakhstan.jpg',
    universities: 15,
    duration: '5 years',
    fees: '₹20-30 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'Affordable education',
      'Modern infrastructure',
      'Strong Indian community',
      'Direct flights from India',
    ],
  },
  {
    id: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    flag: '🇰🇬',
    image: '/images/destinations/kyrgyzstan.jpg',
    universities: 8,
    duration: '6 years',
    fees: '₹18-25 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'Most affordable option',
      'English medium available',
      'Indian food available',
      'Pleasant climate',
    ],
  },
  {
    id: 'philippines',
    name: 'Philippines',
    flag: '🇵🇭',
    image: '/images/destinations/philippines.jpg',
    universities: 12,
    duration: '5.5 years',
    fees: '₹25-35 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'English speaking country',
      'US-based curriculum',
      'Familiar culture',
      'Clinical exposure',
    ],
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    flag: '🇧🇩',
    image: '/images/destinations/bangladesh.jpg',
    universities: 20,
    duration: '5 years',
    fees: '₹35-45 Lakhs (Total)',
    recognition: 'NMC & WHO Eligible',
    highlights: [
      'Similar culture and food',
      'No language barrier',
      'Close to home',
      'Good clinical training',
    ],
  },
];

export const SERVICES = [
  {
    id: 'counseling',
    title: 'Free Career Counseling',
    description: 'Get expert guidance on choosing the right country and university based on your profile, budget, and career goals.',
    icon: 'MessageCircle',
  },
  {
    id: 'university-selection',
    title: 'University Selection',
    description: 'We help you choose from our partner universities that are NMC & WHO Eligible and recognized worldwide.',
    icon: 'GraduationCap',
  },
  {
    id: 'admission',
    title: 'Admission Processing',
    description: 'Complete end-to-end admission support including documentation, application submission, and follow-up.',
    icon: 'FileText',
  },
  {
    id: 'visa',
    title: 'Visa Assistance',
    description: 'Expert guidance for visa application, documentation, and interview preparation with high success rate.',
    icon: 'Plane',
  },
  {
    id: 'travel',
    title: 'Travel & Accommodation',
    description: 'We arrange your travel, airport pickup, and comfortable accommodation near your university.',
    icon: 'Home',
  },
  {
    id: 'support',
    title: 'Post-Arrival Support',
    description: 'Continuous support even after you reach - from registration to settling down in a new country.',
    icon: 'HeartHandshake',
  },
];

export const STATS = [
  { value: '1000+', label: 'Students Placed', suffix: '' },
  { value: '50+', label: 'Partner Universities', suffix: '' },
  { value: '6', label: 'Countries', suffix: '' },
  { value: '98%', label: 'Visa Success Rate', suffix: '' },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    university: 'Tbilisi State Medical University, Georgia',
    batch: '2019-2025',
    image: '/images/testimonials/student-1.jpg',
    rating: 5,
    content: 'ABHA Global Educare made my dream of studying MBBS abroad a reality. Their guidance from admission to settling in Georgia was exceptional. Highly recommended!',
  },
  {
    id: 2,
    name: 'Rahul Patil',
    university: 'Kazan Federal University, Russia',
    batch: '2020-2026',
    image: '/images/testimonials/student-2.jpg',
    rating: 5,
    content: 'The team at ABHA is very professional and supportive. They helped me choose the right university and guided me through every step. Thank you ABHA!',
  },
  {
    id: 3,
    name: 'Sneha Kulkarni',
    university: 'Kazakh National Medical University',
    batch: '2021-2026',
    image: '/images/testimonials/student-3.jpg',
    rating: 5,
    content: 'I was confused about which country to choose for MBBS. ABHA\'s counselors helped me understand all options and I made the best decision. Forever grateful!',
  },
  {
    id: 4,
    name: 'Amit Deshmukh',
    university: 'Osh State University, Kyrgyzstan',
    batch: '2020-2025',
    image: '/images/testimonials/student-4.jpg',
    rating: 5,
    content: 'From NEET counseling to visa approval, ABHA handled everything smoothly. Their post-arrival support in Kyrgyzstan was also amazing.',
  },
];

export const FAQS = [
  {
    question: 'What is the eligibility for MBBS abroad?',
    answer: 'Students must have completed 10+2 with Physics, Chemistry, and Biology with minimum 50% marks (40% for reserved categories). NEET qualification is mandatory for Indian students.',
  },
  {
    question: 'Is NEET required for MBBS abroad?',
    answer: 'Yes, as per NMC guidelines, NEET qualification is mandatory for Indian students seeking MBBS admission abroad. However, there is no minimum cutoff - just qualifying NEET is enough.',
  },
  {
    question: 'Are foreign medical degrees recognized in India?',
    answer: 'Yes, degrees from NMC & WHO Eligible universities are recognized in India. Students need to clear the FMGE/NEXT exam to practice medicine in India after completing MBBS abroad.',
  },
  {
    question: 'What is the total cost of MBBS abroad?',
    answer: 'The total cost varies by country - ranging from ₹18-45 Lakhs for the entire course including tuition, hostel, food, and other expenses. This is significantly lower than private medical colleges in India.',
  },
  {
    question: 'Is the medium of instruction English?',
    answer: 'Yes, most universities recommended by us offer MBBS programs in English medium. Some universities also offer preparatory language courses.',
  },
  {
    question: 'What support do you provide after admission?',
    answer: 'We provide comprehensive post-arrival support including airport pickup, hostel arrangement, university registration, bank account opening, SIM card, and continuous guidance throughout your stay.',
  },
];

export const BRAND_COLORS = {
  navy: '#0B1A35',
  gold: '#C6962E',
  blue: '#1B7C9E',
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
};

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
