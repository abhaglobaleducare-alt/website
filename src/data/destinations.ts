/** Destination detail-page content. */

export interface DestinationFact {
  label: string;
  value: string;
}

export interface DestinationDetailData {
  slug: string;
  name: string;
  flag: string;
  tagline: string;
  intro: string[];
  facts: DestinationFact[];
  universities: string[];
  universitiesNote: string;
  highlights: string[];
  compliance: string;
  seoTitle: string;
  seoDescription: string;
}

export const DESTINATION_DETAILS: Record<string, DestinationDetailData> = {
  georgia: {
    slug: 'georgia',
    name: 'Georgia',
    flag: '🇬🇪',
    tagline: 'European-standard medical & academic education in a safe, welcoming country',
    intro: [
      'Georgia is ABHA’s flagship study destination — English-medium MBBS / M.D., dentistry, nursing, business, IT and postgraduate programmes across leading universities in Tbilisi and Batumi.',
      'We go deep here: our own 200+ bed hostel in Tbilisi (not bunk beds), daily Indian veg & non-veg meals prepared by Indian cooks, and the ABHA Global Services LLC office on the ground for continuous student support.',
    ],
    facts: [
      { label: 'MBBS Duration', value: '5–6 Years (incl. Internship)' },
      { label: 'Medium', value: '100% English' },
      { label: 'MBBS Recognition', value: 'NMC & WHO Eligible' },
      { label: 'On-ground Support', value: 'ABHA office in Tbilisi' },
    ],
    universities: [
      'European University',
      'Alte University',
      'SEU – Georgian National University',
      'East West University',
      'East European University',
      'Caucasus University',
      'University of Georgia',
      'Caucasus International University (CIU)',
      'IBSU',
    ],
    universitiesNote:
      'ABHA partner universities plus the fee-listed universities featured across our course pages. Programme availability varies by university.',
    highlights: [
      'Our own 200+ bed (not bunk-bed) hostel in Tbilisi',
      'Daily Indian veg & non-veg meals by Indian cooks',
      'Full English-medium curriculum at partner universities',
      'ABHA Global Services LLC office on the ground in Tbilisi',
      'One of Europe’s safest countries',
      'Airport pickup and settling-in support',
    ],
    compliance:
      'MBBS / M.D. universities are NMC & WHO Eligible. For practice in India, FMGE/NExT qualification as per NMC norms is mandatory for foreign medical graduates. Non-medical universities are accredited by the Ministry of Education and Science of Georgia.',
    seoTitle: 'Study in Georgia — MBBS & More in Tbilisi | ABHA Global Educare',
    seoDescription:
      'Study MBBS, dentistry, nursing, business & IT in Georgia. English-medium, NMC & WHO Eligible medical universities in Tbilisi & Batumi, with ABHA’s own hostel, Indian food and on-ground office.',
  },
  bosnia: {
    slug: 'bosnia',
    name: 'Bosnia',
    flag: '🇧🇦',
    tagline: 'European medical education in the heart of the Balkans',
    intro: [
      'Bosnia offers English-medium MBBS at accredited public universities, in safe European cities with a growing Indian student community.',
      'ABHA supports accommodation, settling-in and continuous student guidance so families have a single point of contact throughout.',
    ],
    facts: [
      { label: 'MBBS Duration', value: '6 Years' },
      { label: 'Medium', value: 'English' },
      { label: 'Recognition', value: 'NMC & WHO Eligible' },
      { label: 'Campuses', value: 'Sarajevo & Banja Luka' },
    ],
    universities: ['University of East Sarajevo', 'University of Banja Luka'],
    universitiesNote:
      'English-medium MBBS at accredited public universities. Speak to an ABHA counsellor for current intake and fee details.',
    highlights: [
      'English-medium MBBS at accredited public universities',
      'Eligible for FMGE / NExT after graduation',
      'Safe European cities — Sarajevo (capital) & Banja Luka',
      'Welcoming environment with a growing Indian student presence',
      'ABHA-supported accommodation & settling-in guidance',
      'Indian food options available near campus',
    ],
    compliance:
      'MBBS universities are NMC & WHO Eligible. For practice in India, FMGE/NExT qualification as per NMC norms is mandatory for foreign medical graduates.',
    seoTitle: 'Study MBBS in Bosnia | ABHA Global Educare',
    seoDescription:
      'English-medium MBBS in Bosnia at accredited public universities in Sarajevo & Banja Luka — NMC & WHO Eligible, eligible for FMGE / NExT. ABHA guides your admission.',
  },
  'timor-leste': {
    slug: 'timor-leste',
    name: 'Timor-Leste',
    flag: '🇹🇱',
    tagline: 'English-medium MBBS at Nalanda College of Medicine, Dili',
    intro: [
      'Timor-Leste is ABHA’s newest MBBS destination through Nalanda College of Medicine in the capital, Dili. The programme is delivered 100% in English and is structured as per NMC FMGL 2021 norms.',
      'With a limited intake and an all-inclusive fee structure, Nalanda offers Indian students an affordable, well-supported route into medicine.',
    ],
    facts: [
      { label: 'Duration', value: '4.5 Yrs + 1 Yr Internship' },
      { label: 'Medium', value: '100% English' },
      { label: 'Intake', value: '125 seats / year' },
      { label: 'Hostel & Food', value: '$3,000 / year' },
    ],
    universities: ['Nalanda College of Medicine, Dili'],
    universitiesNote:
      'Programme structured as per NMC FMGL 2021 norms. See the Medicine course page for the full year-wise fee structure.',
    highlights: [
      '100% English-medium MBBS programme',
      'Programme structured as per NMC FMGL 2021 norms',
      'Limited intake of 125 seats per year',
      'Hostel & food at $3,000 / year',
      '4.5 years of study plus a 1-year internship',
      'Verified, all-inclusive fee structure on the Medicine page',
    ],
    compliance:
      'The programme is structured as per NMC FMGL 2021 norms. For practice in India, FMGE/NExT qualification as per NMC norms is mandatory for foreign medical graduates.',
    seoTitle: 'Study MBBS in Timor-Leste — Nalanda College of Medicine, Dili | ABHA',
    seoDescription:
      'English-medium MBBS at Nalanda College of Medicine, Dili, Timor-Leste — 4.5 years + 1 year internship, 125 seats/year, structured as per NMC FMGL 2021 norms. Verified fees via ABHA.',
  },
};
