'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  countries,
  funnelStages,
  stageStatusClasses,
  universitiesByCountry,
} from '../../lib/constants/students';

interface StudentHistory {
  id: string;
  stage: string;
  stage_status: string;
  stage_notes?: string | null;
  documents_url?: string[] | null;
  amount?: number | null;
  payment_method?: string | null;
  payment_date?: string | null;
  payment_receipt_url?: string | null;
  updated_at: string;
}

interface FeeSchedule {
  id: string;
  fee_type?: string | null;
  year_number?: number | null;
  total_amount?: number | null;
  paid_amount?: number | null;
  pending_amount?: number | null;
  due_date?: string | null;
  receipt_url?: string | null;
}

interface AgestDisbursement {
  id: string;
  year_number?: number | null;
  amount_usd?: number | null;
  status?: string | null;
  disbursed_date?: string | null;
  proof_url?: string | null;
}

interface AdmissionBonus {
  id: string;
  bonus_type?: string | null;
  bonus_amount?: number | null;
  status?: string | null;
  notes?: string | null;
  disbursed_date?: string | null;
}

interface StudentDetailData {
  id: string;
  student_code?: string | null;
  full_name?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  photo_url?: string | null;
  phone?: string | null;
  parent_phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  reference_source?: string | null;
  reference_details?: string | null;
  neet_score?: number | null;
  neet_year?: number | null;
  twelfth_percentage?: number | null;
  board?: string | null;
  school_name?: string | null;
  selected_country?: string | null;
  selected_university?: string | null;
  intake_year?: number | null;
  intake_month?: string | null;
  notes?: string | null;
  funnel_stage?: string | null;
  created_at?: string | null;
  assigned_staff?: { full_name?: string | null };
  office?: { name?: string | null };
  student_funnel_history?: StudentHistory[];
  fee_schedule?: FeeSchedule[];
  agest_disbursement?: AgestDisbursement[];
  admission_bonus?: AdmissionBonus[];
}

interface StudentDetailProps {
  studentId: string;
  isAdmin?: boolean;
  portalBase: string;
}

export function StudentDetail({ studentId, isAdmin = false, portalBase }: StudentDetailProps) {
  const [student, setStudent] = useState<StudentDetailData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('Georgia');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('European University');
  // ensure `isAdmin` is referenced to avoid unused-var lint when not yet used
  void isAdmin;
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const stageMap = useMemo(
    () =>
      funnelStages.map((stage) => {
        const history = student?.student_funnel_history
          ?.filter((item) => item.stage === stage)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

        return {
          stage,
          history,
          status: history?.stage_status ?? 'pending',
          completed: history?.stage_status === 'completed',
        };
      }),
    [student],
  );

  useEffect(() => {
    if (student?.selected_country) {
      setSelectedCountry(student.selected_country);
      setSelectedUniversity(
        student.selected_university ??
          universitiesByCountry[student.selected_country as keyof typeof universitiesByCountry][0],
      );
    }
  }, [student]);

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const loadStudent = async () => {
      setLoading(true);
      const response = await fetch(`/api/students/${studentId}`);
      const json = await response.json();
      setLoading(false);
      if (json.ok) {
        setStudent(json.student);
      } else {
        setStatus(json.error ?? 'Unable to load student.');
      }
    };

    loadStudent();
  }, [studentId]);

  const updateStudent = async (payload: Record<string, unknown>) => {
    setLoading(true);
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setLoading(false);
    if (json.ok) {
      setStatus(json.message ?? 'Saved successfully.');
      const refreshed = await fetch(`/api/students/${studentId}`);
      const refreshedJson = await refreshed.json();
      if (refreshedJson.ok) {
        setStudent(refreshedJson.student);
      }
    } else {
      setStatus(json.error ?? 'Update failed.');
    }
  };

  const handleCompleteStage = async (stage: string) => {
    await updateStudent({
      stage,
      stage_status: 'completed',
      stage_notes: `Stage completed on ${new Date().toLocaleDateString()}.`,
    });
  };

  const handleUploadDocument = async (
    stage: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'student-documents');

    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const uploadJson = await uploadRes.json();
    if (uploadJson.ok) {
      await updateStudent({
        stage,
        stage_notes: `Uploaded document for ${stage}.`,
        documents_url: [uploadJson.url],
      });
      setStatus('Document uploaded and attached to stage.');
    } else {
      setStatus(uploadJson.error ?? 'Upload failed.');
    }
    setLoading(false);
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!student) return;

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      full_name: String(formData.get('full_name') ?? student.full_name ?? ''),
      phone: String(formData.get('phone') ?? student.phone ?? ''),
      email: String(formData.get('email') ?? student.email ?? ''),
      address: String(formData.get('address') ?? student.address ?? ''),
      city: String(formData.get('city') ?? student.city ?? ''),
      state: String(formData.get('state') ?? student.state ?? ''),
      selected_country: String(formData.get('selected_country') ?? student.selected_country ?? ''),
      selected_university: String(
        formData.get('selected_university') ?? student.selected_university ?? '',
      ),
      intake_year: Number(formData.get('intake_year') ?? student.intake_year ?? 0) || null,
      intake_month: String(formData.get('intake_month') ?? student.intake_month ?? ''),
      notes: String(formData.get('notes') ?? student.notes ?? ''),
      funnel_stage: String(formData.get('funnel_stage') ?? student.funnel_stage ?? ''),
    };

    await updateStudent(payload);
  };

  if (!student) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
          <p>{loading ? 'Loading student details…' : status || 'Student not found.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Student CRM</p>
            <h1 className="mt-2 text-3xl font-semibold">{student.full_name}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Lead detail, funnel updates, fee schedule, and audit history for this student.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`${portalBase}/students`}>
              <Button variant="ghost">Back to students</Button>
            </Link>
            <Button onClick={() => setEditMode((value) => !value)} variant="ghost">
              {editMode ? 'Hide edit' : 'Edit student'}
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
                <h2 className="mt-2 text-2xl font-semibold">Student snapshot</h2>
              </div>
              <div className="space-y-1 text-right text-sm text-slate-400">
                <p>{student.student_code}</p>
                <p>{student.office?.name ?? 'Office not assigned'}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-300">Assigned staff</p>
                <p className="text-lg font-semibold">
                  {student.assigned_staff?.full_name ?? 'Not assigned'}
                </p>
              </div>
              <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-300">Funnel stage</p>
                <p className="text-lg font-semibold">{student.funnel_stage ?? 'Lead Generated'}</p>
              </div>
              <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-300">University</p>
                <p className="text-lg font-semibold">{student.selected_university ?? 'Pending'}</p>
              </div>
              <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-300">Added</p>
                <p className="text-lg font-semibold">
                  {student.created_at
                    ? format(new Date(student.created_at), 'MMM d, yyyy')
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bonus & status</p>
                <h2 className="mt-2 text-2xl font-semibold">Bonuses</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {student.admission_bonus?.length ? (
                student.admission_bonus.map((bonus) => (
                  <div
                    key={bonus.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                  >
                    <p className="text-sm text-slate-300">{bonus.bonus_type}</p>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <p className="text-lg font-semibold">${bonus.bonus_amount ?? 0}</p>
                      <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs text-saffron">
                        {bonus.status ?? 'pending'}
                      </span>
                    </div>
                    {bonus.notes ? (
                      <p className="mt-2 text-sm text-slate-400">{bonus.notes}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                  Admission and referral bonus records will appear after the student reaches
                  university registration.
                </div>
              )}
            </div>
          </Card>
        </section>

        {editMode ? (
          <Card>
            <h2 className="text-xl font-semibold">Edit student profile</h2>
            <form className="mt-6 grid gap-4" onSubmit={handleProfileSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200" htmlFor="full_name">
                  Full name
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={student.full_name ?? ''}
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="phone">
                  Phone
                  <Input id="phone" name="phone" type="tel" defaultValue={student.phone ?? ''} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="email">
                  Email
                  <Input id="email" name="email" type="email" defaultValue={student.email ?? ''} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="city">
                  City
                  <Input id="city" name="city" defaultValue={student.city ?? ''} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="state">
                  State
                  <Input id="state" name="state" defaultValue={student.state ?? ''} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="address">
                  Address
                  <Input id="address" name="address" defaultValue={student.address ?? ''} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="selected_country">
                  Country
                  <select
                    name="selected_country"
                    defaultValue={student.selected_country ?? 'Georgia'}
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
                    id="selected_university"
                    name="selected_university"
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  >
                    {universitiesByCountry[
                      selectedCountry as keyof typeof universitiesByCountry
                    ].map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
                  Notes
                  <textarea
                    name="notes"
                    defaultValue={student.notes ?? ''}
                    className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save changes'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Funnel journey</p>
                <h2 className="mt-2 text-2xl font-semibold">Lead stages</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {stageMap.map((entry) => (
                <div
                  key={entry.stage}
                  className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">{entry.stage}</p>
                      <p className="mt-2 text-lg font-semibold">
                        {entry.history?.stage_status === 'completed' ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        stageStatusClasses[entry.status as keyof typeof stageStatusClasses]
                      }`}
                    >
                      {entry.status.replace('_', ' ')}
                    </span>
                  </div>
                  {entry.history?.stage_notes ? (
                    <p className="mt-4 text-sm text-slate-300">{entry.history.stage_notes}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-full border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 transition hover:border-saffron">
                      Upload documents
                      <input
                        type="file"
                        accept="*/*"
                        className="sr-only"
                        onChange={(event) => handleUploadDocument(entry.stage, event)}
                      />
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleCompleteStage(entry.stage)}
                      disabled={entry.completed || loading}
                    >
                      {entry.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                  {entry.history?.documents_url?.length ? (
                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-sm text-slate-300">
                      {entry.history.documents_url.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-saffron underline"
                        >
                          View document
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold">Fee schedule</h2>
              {student.fee_schedule?.length ? (
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  {student.fee_schedule.map((fee) => (
                    <div
                      key={fee.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p>{fee.fee_type ?? 'Fee item'}</p>
                        <p>${fee.total_amount ?? 0}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        Paid: ${fee.paid_amount ?? 0} · Pending: ${fee.pending_amount ?? 0}
                      </p>
                      {fee.due_date ? (
                        <p className="mt-1 text-sm text-slate-400">
                          Due {format(new Date(fee.due_date), 'MMM d, yyyy')}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">
                  No fee schedule records yet. Add a fee schedule entry when payment milestones are
                  set.
                </p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-semibold">AGEST disbursement</h2>
              {student.agest_disbursement?.length ? (
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  {student.agest_disbursement
                    .sort((a, b) => (a.year_number ?? 0) - (b.year_number ?? 0))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p>Year {item.year_number}</p>
                          <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs text-saffron">
                            {item.status ?? 'scheduled'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">${item.amount_usd ?? 0}</p>
                        {item.disbursed_date ? (
                          <p className="mt-1 text-sm text-slate-400">
                            Paid {format(new Date(item.disbursed_date), 'MMM d, yyyy')}
                          </p>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">
                  Automatic AGEST entries are created for six years when the student is added.
                </p>
              )}
            </Card>
          </div>
        </section>

        <Card>
          <h2 className="text-xl font-semibold">Audit trail</h2>
          <div className="mt-6 space-y-4">
            {student.student_funnel_history?.length ? (
              student.student_funnel_history
                .slice()
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .map((history) => (
                  <div
                    key={history.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{history.stage}</p>
                      <span className="text-slate-400">
                        {format(new Date(history.updated_at), 'PPP')}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-300">
                      Status: {history.stage_status.replace('_', ' ')}
                    </p>
                    {history.stage_notes ? (
                      <p className="mt-2 text-slate-300">{history.stage_notes}</p>
                    ) : null}
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-300">No audit history recorded yet.</p>
            )}
          </div>
        </Card>

        {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
      </div>
    </main>
  );
}
