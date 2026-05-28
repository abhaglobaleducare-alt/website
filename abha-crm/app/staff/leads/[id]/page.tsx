'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { leadStatuses, getLeadStatusLabel } from '../../../../lib/constants/leads';
import { countries, universitiesByCountry } from '../../../../lib/constants/students';

interface Lead {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  parent_phone?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  neet_score?: number | null;
  neet_year?: number | null;
  interest?: string | null;
  preferred_country?: string | null;
  lead_source?: string | null;
  lead_status?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  created_at?: string | null;
  converted_to_student_id?: string | null;
}

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');

  useEffect(() => {
    fetch(`/api/leads/${leadId}`)
      .then((res) => res.json())
      .then((json) => setLead(json.lead))
      .catch(() => setLead(null));
  }, [leadId]);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_status: newStatus }),
    });
    const json = await response.json();
    setLoading(false);

    if (json.ok && lead) {
      setLead({ ...lead, lead_status: newStatus });
    }
  };

  const handleConvert = async () => {
    if (!lead) return;

    setConverting(true);
    const response = await fetch(`/api/leads/convert/${leadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_country: selectedCountry,
        selected_university: selectedUniversity,
      }),
    });

    const json = await response.json();
    setConverting(false);

    if (json.ok) {
      window.location.href = `/staff/students/${json.student.id}`;
    } else {
      alert(json.error ?? 'Conversion failed');
    }
  };

  if (!lead) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <Card>
          <p className="text-slate-300">Lead not found.</p>
        </Card>
      </main>
    );
  }

  const isConverted = !!lead.converted_to_student_id;
  const universityList = selectedCountry
    ? universitiesByCountry[selectedCountry as keyof typeof universitiesByCountry] || []
    : [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Lead Detail</p>
            <h1 className="mt-2 text-3xl font-semibold">{lead.full_name ?? 'Unnamed'}</h1>
          </div>
          <Link href="/staff/leads">
            <Button variant="ghost">Back to leads</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-xl font-semibold">Basic information</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Phone</p>
              <p className="mt-1 font-semibold">{lead.phone ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Parent phone</p>
              <p className="mt-1 font-semibold">{lead.parent_phone ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-1 font-semibold">{lead.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">City</p>
              <p className="mt-1 font-semibold">{lead.city ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">NEET Score</p>
              <p className="mt-1 font-semibold">{lead.neet_score ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">NEET Year</p>
              <p className="mt-1 font-semibold">{lead.neet_year ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Interest</p>
              <p className="mt-1 font-semibold">{lead.interest ?? '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Preferred country</p>
              <p className="mt-1 font-semibold">{lead.preferred_country ?? '-'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="status">
              Lead status
              <select
                id="status"
                value={lead.lead_status ?? 'new'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                {leadStatuses.map((s) => (
                  <option key={s} value={s}>
                    {getLeadStatusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-sm text-slate-400">Follow-up date</p>
              <p className="mt-1 font-semibold">{lead.follow_up_date ?? '-'}</p>
            </div>
          </div>

          {lead.notes && (
            <div className="mt-6">
              <p className="text-sm text-slate-400">Notes</p>
              <p className="mt-2 rounded-2xl bg-slate-900/50 p-3 text-sm">{lead.notes}</p>
            </div>
          )}
        </Card>

        {!isConverted && lead.lead_status === 'qualified' && (
          <Card>
            <h2 className="text-xl font-semibold">Convert to student</h2>
            <p className="mt-2 text-sm text-slate-300">
              Convert this qualified lead to a student record to proceed with the enrollment
              process.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200" htmlFor="country">
                Country
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedUniversity('');
                  }}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-200" htmlFor="university">
                University
                <select
                  id="university"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  required
                  disabled={!selectedCountry}
                >
                  <option value="">Select university</option>
                  {universityList.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={handleConvert}
                disabled={converting || !selectedCountry || !selectedUniversity}
              >
                {converting ? 'Converting…' : 'Convert to Student'}
              </Button>
            </div>
          </Card>
        )}

        {isConverted && (
          <Card className="border-emerald-700 bg-emerald-500/10">
            <p className="text-emerald-200">✓ This lead has been converted to a student record.</p>
            <Link href={`/staff/students/${lead.converted_to_student_id}`}>
              <Button size="sm" className="mt-4">
                View Student Record
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </main>
  );
}
