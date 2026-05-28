'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { funnelStages, universitiesByCountry, countries } from '../../../lib/constants/students';

interface StudentSummary {
  id: string;
  student_code?: string | null;
  full_name?: string | null;
  phone?: string | null;
  funnel_stage?: string | null;
  selected_university?: string | null;
  selected_country?: string | null;
  created_at?: string | null;
}

function getStageClass(stage?: string) {
  if (!stage) {
    return 'bg-slate-800 text-slate-200';
  }

  if (stage.includes('Lead') || stage.includes('Initial') || stage.includes('Counselling')) {
    return 'bg-amber-500/15 text-amber-200';
  }

  if (stage.includes('Admission') || stage.includes('Fee') || stage.includes('Visa')) {
    return 'bg-sky-500/15 text-sky-200';
  }

  return 'bg-emerald-500/15 text-emerald-200';
}

export default function StaffStudentsPage() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('scope', 'staff');
    if (search) params.set('search', search);
    if (stageFilter) params.set('stage', stageFilter);
    if (countryFilter) params.set('country', countryFilter);
    if (universityFilter) params.set('university', universityFilter);

    fetch(`/api/students?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));

    return () => controller.abort();
  }, [search, stageFilter, countryFilter, universityFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('scope', 'staff');
    if (countryFilter) params.set('country', countryFilter);
    if (universityFilter) params.set('university', universityFilter);

    fetch(`/api/students/counts?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setCounts(json.counts ?? {}))
      .catch(() => setCounts({}));
  }, [countryFilter, universityFilter, search]);

  const universityOptions = useMemo(
    () => [...universitiesByCountry.Georgia, ...universitiesByCountry.Kyrgyzstan],
    [],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Student CRM</p>
            <h1 className="mt-2 text-3xl font-semibold">My students</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Browse the students assigned to your account, filter by stage, and open the full lead
              profile.
            </p>
          </div>
          <Link href="/staff/students/new">
            <Button>Create new student</Button>
          </Link>
        </header>

        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or phone"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="stage">
              Funnel stage
              <select
                id="stage"
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All stages</option>
                {funnelStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="country">
              Country
              <select
                id="country"
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="university">
              University
              <select
                id="university"
                value={universityFilter}
                onChange={(event) => setUniversityFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All universities</option>
                {universityOptions.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {funnelStages.map((stage) => (
              <div key={stage} className="flex-none">
                <div className="rounded-full bg-white/5 px-3 py-1 text-sm">
                  {stage} · <span className="font-semibold">{counts[stage] ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="grid gap-4">
          {students.length === 0 ? (
            <Card>
              <p className="text-slate-300">No student leads match your filters yet.</p>
            </Card>
          ) : (
            students.map((student) => (
              <Link key={student.id} href={`/staff/students/${student.id}`}>
                <Card className="cursor-pointer transition hover:bg-slate-900/95">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{student.student_code}</p>
                      <h2 className="mt-2 text-xl font-semibold">
                        {student.full_name ?? 'Unnamed student'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {student.phone ?? 'No phone provided'}
                      </p>
                    </div>
                    <div className="space-y-2 text-right text-sm">
                      <span
                        className={[
                          'inline-flex rounded-full px-3 py-1',
                          getStageClass(student.funnel_stage ?? ''),
                        ].join(' ')}
                      >
                        {student.funnel_stage ?? 'Lead Generated'}
                      </span>
                      <p className="text-slate-400">
                        {student.selected_university ?? 'University TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                    <p>{student.selected_country ?? 'Country not set'}</p>
                    <p>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : 'Date unknown'}
                    </p>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
