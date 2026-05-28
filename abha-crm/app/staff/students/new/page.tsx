'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  countries,
  genders,
  referenceSources,
  universitiesByCountry,
} from '../../../../lib/constants/students';

const intakeMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function NewStudentPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'Georgia' | 'Kyrgyzstan'>('Georgia');
  const [selectedUniversity, setSelectedUniversity] = useState<string>(
    universitiesByCountry.Georgia[0],
  );
  const [referrerSearch, setReferrerSearch] = useState('');
  const [referrerResults, setReferrerResults] = useState<{ id: string; full_name: string }[]>([]);
  const [selectedReferrerId, setSelectedReferrerId] = useState('');

  useEffect(() => {
    if (selectedCountry === 'Georgia') {
      setSelectedUniversity(universitiesByCountry.Georgia[0]);
    } else {
      setSelectedUniversity(universitiesByCountry.Kyrgyzstan[0]);
    }
  }, [selectedCountry]);

  const canSubmit = step === 3;

  const selectedUniversityOptions = useMemo(
    () => universitiesByCountry[selectedCountry],
    [selectedCountry],
  );

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'student-photos');

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setPhotoUrl(json.url);
      setStatus('Photo uploaded successfully.');
    } else {
      setStatus(json.error ?? 'Photo upload failed.');
    }
  };

  const searchReferrers = async (query: string) => {
    if (!query.trim()) {
      setReferrerResults([]);
      return;
    }

    const response = await fetch(`/api/students?scope=admin&search=${encodeURIComponent(query)}`);
    const json = await response.json();
    if (json.ok) {
      setReferrerResults((json.students ?? []).slice(0, 5));
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (referrerSearch) {
        searchReferrers(referrerSearch);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [referrerSearch]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      full_name: String(formData.get('full_name') ?? ''),
      father_name: String(formData.get('father_name') ?? ''),
      mother_name: String(formData.get('mother_name') ?? ''),
      dob: String(formData.get('dob') ?? ''),
      gender: String(formData.get('gender') ?? 'other'),
      photo_url: photoUrl || null,
      phone: String(formData.get('phone') ?? ''),
      parent_phone: String(formData.get('parent_phone') ?? ''),
      whatsapp: String(formData.get('whatsapp') ?? ''),
      email: String(formData.get('email') ?? ''),
      address: String(formData.get('address') ?? ''),
      city: String(formData.get('city') ?? ''),
      state: String(formData.get('state') ?? ''),
      reference_source: String(formData.get('reference_source') ?? 'walk-in'),
      reference_details: String(formData.get('reference_details') ?? ''),
      referrer_student_id: selectedReferrerId || null,
      neet_score: Number(formData.get('neet_score') ?? 0) || null,
      neet_year: Number(formData.get('neet_year') ?? 0) || null,
      twelfth_percentage: Number(formData.get('twelfth_percentage') ?? 0) || null,
      board: String(formData.get('board') ?? ''),
      school_name: String(formData.get('school_name') ?? ''),
      selected_country: selectedCountry,
      selected_university: selectedUniversity,
      intake_year: Number(formData.get('intake_year') ?? 0) || null,
      intake_month: String(formData.get('intake_month') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    };

    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus('Student lead created successfully.');
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStatus(json.error ?? 'Could not create the student lead.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Phase 5</p>
            <h1 className="mt-2 text-3xl font-semibold">New student lead</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Capture the student profile, referral source, academic readiness and admission intent.
            </p>
          </div>
          <Link href="/staff/students">
            <Button variant="ghost">Back to students</Button>
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_0.4fr]">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Student lead wizard
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Step {step} of 3</h2>
              </div>
              <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-saffron">
                {step === 1
                  ? 'Basic info'
                  : step === 2
                    ? 'Reference & academics'
                    : 'Admission details'}
              </span>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="full_name">
                    Full name
                    <Input id="full_name" name="full_name" placeholder="Priya Patil" required />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="father_name">
                    Father name
                    <Input id="father_name" name="father_name" placeholder="Ashok Patil" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="mother_name">
                    Mother name
                    <Input id="mother_name" name="mother_name" placeholder="Sunita Patil" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="dob">
                    DOB
                    <Input id="dob" name="dob" type="date" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="gender">
                    Gender
                    <select
                      id="gender"
                      name="gender"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                    >
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="photo">
                    Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none"
                      id="photo"
                      onChange={handlePhotoUpload}
                    />
                    {photoUrl ? (
                      <p className="text-sm text-slate-300">Photo uploaded successfully.</p>
                    ) : null}
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="phone">
                    Phone
                    <Input id="phone" name="phone" placeholder="+91 9876543210" required />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="parent_phone">
                    Parent phone
                    <Input id="parent_phone" name="parent_phone" placeholder="+91 9876543211" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="whatsapp">
                    WhatsApp
                    <Input id="whatsapp" name="whatsapp" placeholder="+91 9876543212" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="email">
                    Email
                    <Input id="email" name="email" type="email" placeholder="student@example.com" />
                  </label>
                  <label
                    className="space-y-2 text-sm text-slate-200 md:col-span-2"
                    htmlFor="address"
                  >
                    Address
                    <Input id="address" name="address" placeholder="123 Main Street" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="city">
                    City
                    <Input id="city" name="city" placeholder="Kolhapur" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="state">
                    State
                    <Input id="state" name="state" placeholder="Maharashtra" />
                  </label>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label
                    className="space-y-2 text-sm text-slate-200 md:col-span-2"
                    htmlFor="reference_source"
                  >
                    Reference source
                    <select
                      name="reference_source"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                      defaultValue="walk-in"
                    >
                      {referenceSources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label
                    className="space-y-2 text-sm text-slate-200 md:col-span-2"
                    htmlFor="reference_details"
                  >
                    Reference details
                    <textarea
                      name="reference_details"
                      className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                      placeholder="Referral partner, social post, walk-in source..."
                    />
                  </label>
                  <label
                    className="space-y-2 text-sm text-slate-200 md:col-span-2"
                    htmlFor="referrer_search"
                  >
                    Search existing students as referrer
                    <Input
                      id="referrer_search"
                      value={referrerSearch}
                      onChange={(event) => setReferrerSearch(event.target.value)}
                      placeholder="Search name or phone"
                    />
                  </label>
                  {referrerResults.length ? (
                    <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-200">
                      {referrerResults.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          className={`block w-full text-left rounded-2xl px-4 py-3 text-sm transition hover:bg-white/5 ${
                            selectedReferrerId === student.id ? 'bg-saffron/10' : ''
                          }`}
                          onClick={() => setSelectedReferrerId(student.id)}
                        >
                          {student.full_name}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="neet_score">
                    NEET score
                    <Input id="neet_score" name="neet_score" type="number" placeholder="450" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="neet_year">
                    NEET year
                    <Input id="neet_year" name="neet_year" type="number" placeholder="2026" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="twelfth_percentage">
                    12th percentage
                    <Input
                      name="twelfth_percentage"
                      type="number"
                      step="0.01"
                      placeholder="89.50"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="board">
                    Board
                    <Input id="board" name="board" placeholder="CBSE" />
                  </label>
                  <label
                    className="space-y-2 text-sm text-slate-200 md:col-span-2"
                    htmlFor="school_name"
                  >
                    School name
                    <Input id="school_name" name="school_name" placeholder="ABHA Public School" />
                  </label>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="selected_country">
                    Country
                    <select
                      name="selected_country"
                      value={selectedCountry}
                      onChange={(event) =>
                        setSelectedCountry(event.target.value as 'Georgia' | 'Kyrgyzstan')
                      }
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="selected_university">
                    University
                    <select
                      name="selected_university"
                      value={selectedUniversity}
                      onChange={(event) => setSelectedUniversity(event.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                    >
                      {selectedUniversityOptions.map((university) => (
                        <option key={university} value={university}>
                          {university}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="intake_year">
                    Intake year
                    <Input id="intake_year" name="intake_year" type="number" placeholder="2026" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200" htmlFor="intake_month">
                    Intake month
                    <select
                      name="intake_month"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                    >
                      {intakeMonths.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
                    Notes
                    <textarea
                      name="notes"
                      className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                      placeholder="Capture admission readiness, export goals, or counselling notes."
                    />
                  </label>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep((value) => Math.max(1, value - 1))}
                    >
                      Back
                    </Button>
                  ) : null}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep((value) => Math.min(3, value + 1))}
                    >
                      Continue
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
                  <Button type="submit" disabled={loading || !canSubmit}>
                    {loading ? 'Saving…' : 'Create student lead'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Lead summary</h2>
            <p className="mt-3 text-sm text-slate-300">
              Complete the form in three steps to avoid missing core lead information and to assign
              the student to your office automatically.
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <p>• Step 1 collects the student identity and contact details.</p>
              <p>• Step 2 captures referral source and academic readiness.</p>
              <p>• Step 3 sets the target university and intake plan.</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
