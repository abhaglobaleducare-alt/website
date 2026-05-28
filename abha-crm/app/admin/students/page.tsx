'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { countries, funnelStages, universitiesByCountry } from '../../../lib/constants/students';
import { offices } from '../../../lib/constants/staff';

interface StudentSummary {
  id: string;
  student_code?: string | null;
  full_name?: string | null;
  phone?: string | null;
  funnel_stage?: string | null;
  selected_university?: string | null;
  selected_country?: string | null;
  created_at?: string | null;
  assigned_staff_id?: string | null;
  office_id?: string | null;
}

interface StaffMember {
  id: string;
  full_name?: string | null;
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

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const stageParam = new URLSearchParams(window.location.search).get('stage');
    if (stageParam) setStageFilter(stageParam);
  }, []);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => setStaff(json.staff ?? []))
      .catch(() => setStaff([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (search) params.set('search', search);
    if (stageFilter) params.set('stage', stageFilter);
    if (countryFilter) params.set('country', countryFilter);
    if (universityFilter) params.set('university', universityFilter);
    if (officeFilter) params.set('office_id', officeFilter);
    if (staffFilter) params.set('staff_id', staffFilter);

    fetch(`/api/students?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));

    return () => controller.abort();
  }, [search, stageFilter, countryFilter, universityFilter, officeFilter, staffFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (countryFilter) params.set('country', countryFilter);
    if (universityFilter) params.set('university', universityFilter);
    if (officeFilter) params.set('office_id', officeFilter);
    if (staffFilter) params.set('staff_id', staffFilter);

    fetch(`/api/students/counts?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setCounts(json.counts ?? {}))
      .catch(() => setCounts({}));
  }, [countryFilter, universityFilter, officeFilter, staffFilter, search]);

  const universityOptions = useMemo(
    () => [...universitiesByCountry.Georgia, ...universitiesByCountry.Kyrgyzstan],
    [],
  );

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const left = a[sortField as keyof StudentSummary] ?? '';
      const right = b[sortField as keyof StudentSummary] ?? '';

      if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(String(left)).getTime() - new Date(String(right)).getTime()
          : new Date(String(right)).getTime() - new Date(String(left)).getTime();
      }

      return sortDirection === 'asc'
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
  }, [students, sortField, sortDirection]);

  const downloadCsv = () => {
    const headers = ['Student Code', 'Name', 'Phone', 'Stage', 'University', 'Country', 'Added'];
    const rows = sortedStudents.map((student) => [
      student.student_code ?? '',
      student.full_name ?? '',
      student.phone ?? '',
      student.funnel_stage ?? '',
      student.selected_university ?? '',
      student.selected_country ?? '',
      student.created_at ? new Date(student.created_at).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin CRM</p>
            <h1 className="mt-2 text-3xl font-semibold">All students</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              View every student lead across offices, sort by stage, and open complete records.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadCsv} variant="ghost">
              Export to Excel
            </Button>
          </div>
        </header>

        <Card>
          <div className="grid gap-4 md:grid-cols-6">
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or phone"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Office
              <select
                value={officeFilter}
                onChange={(event) => setOfficeFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All offices</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Staff
              <select
                value={staffFilter}
                onChange={(event) => setStaffFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All staff</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Stage
              <select
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
            <label className="space-y-2 text-sm text-slate-200">
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
            <label className="space-y-2 text-sm text-slate-200">
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

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span>Sort by:</span>
              {['created_at', 'full_name', 'funnel_stage'].map((field) => (
                <button
                  key={field}
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    sortField === field ? 'bg-saffron/15 text-saffron' : 'bg-white/5 text-slate-200'
                  }`}
                  onClick={() => setSortField(field)}
                >
                  {field === 'created_at' ? 'Date added' : field === 'full_name' ? 'Name' : 'Stage'}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 hover:border-saffron"
              onClick={() => setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'))}
            >
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>

          {sortedStudents.length === 0 ? (
            <p className="text-slate-300">No students match the selected filters.</p>
          ) : (
            <div className="space-y-4">
              {sortedStudents.map((student) => (
                <Link key={student.id} href={`/admin/students/${student.id}`}>
                  <article className="cursor-pointer rounded-3xl border border-white/10 bg-slate-900/80 p-5 transition hover:bg-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{student.student_code}</p>
                        <h2 className="mt-2 text-xl font-semibold">
                          {student.full_name ?? 'Unnamed student'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-300">{student.phone ?? 'No phone'}</p>
                      </div>
                      <div className="text-right text-sm">
                        <span
                          className={
                            'inline-flex rounded-full px-3 py-1 ' +
                            getStageClass(student.funnel_stage ?? '')
                          }
                        >
                          {student.funnel_stage ?? 'Lead Generated'}
                        </span>
                        <p className="mt-2 text-slate-400">
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
                  </article>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
