'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { offices } from '../../../lib/constants/staff';
import {
  goalTypes,
  goalPriorities,
  goalStatuses,
  priorityClasses,
  priorityAccent,
  statusClasses,
  titleCase,
  type GoalPriority,
  type GoalStatus,
} from '../../../lib/constants/goals';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  goal_type: string;
  priority: GoalPriority;
  status: GoalStatus;
  due_date?: string | null;
  reminder_time?: string | null;
}

interface StaffMember {
  id: string;
  full_name?: string | null;
  office_id?: string | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function AdminGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [staffFilter, setStaffFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [assignOpen, setAssignOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [formStatus, setFormStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => setStaff(json.staff ?? []))
      .catch(() => setStaff([]));
  }, []);

  const loadGoals = () => {
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (staffFilter) params.set('staff_id', staffFilter);
    if (officeFilter) params.set('office_id', officeFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/goals?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setGoals(json.goals ?? []))
      .catch(() => setGoals([]));
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffFilter, officeFilter, typeFilter, priorityFilter, statusFilter]);

  const staffName = (id: string) =>
    staff.find((member) => member.id === id)?.full_name ?? 'Unknown staff';

  const completionByStaff = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    goals.forEach((goal) => {
      const entry = map.get(goal.user_id) ?? { total: 0, completed: 0 };
      entry.total += 1;
      if (goal.status === 'completed') entry.completed += 1;
      map.set(goal.user_id, entry);
    });
    return Array.from(map.entries()).map(([id, value]) => ({
      id,
      name: staffName(id),
      ...value,
      rate: value.total ? Math.round((value.completed / value.total) * 100) : 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, staff]);

  const handleAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('');
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      user_id: String(formData.get('user_id') ?? ''),
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      goal_type: String(formData.get('goal_type') ?? ''),
      priority: String(formData.get('priority') ?? 'medium'),
      due_date: String(formData.get('due_date') ?? '') || null,
      reminder_time: String(formData.get('reminder_time') ?? '') || null,
    };

    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setSaving(false);
    if (json.ok) {
      setAssignOpen(false);
      loadGoals();
    } else {
      setFormStatus(json.error ?? 'Could not assign goal.');
    }
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setFormStatus('');
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get('title') ?? '').trim(),
      priority: String(formData.get('priority') ?? ''),
      status: String(formData.get('status') ?? ''),
      due_date: String(formData.get('due_date') ?? '') || null,
      reminder_time: String(formData.get('reminder_time') ?? '') || null,
      completion_notes: String(formData.get('completion_notes') ?? '').trim() || undefined,
    };

    const response = await fetch(`/api/goals/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setSaving(false);
    if (json.ok) {
      setEditing(null);
      loadGoals();
    } else {
      setFormStatus(json.error ?? 'Could not update goal.');
    }
  };

  const handleDelete = async (goal: Goal) => {
    if (!window.confirm(`Delete goal "${goal.title}"? This cannot be undone.`)) return;
    const response = await fetch(`/api/goals/${goal.id}`, { method: 'DELETE' });
    const json = await response.json();
    if (json.ok) {
      setGoals((prev) => prev.filter((item) => item.id !== goal.id));
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Goal Management</p>
            <h1 className="mt-2 text-3xl font-semibold">All staff goals</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Assign goals across the team, track completion rates, and keep priorities aligned.
            </p>
          </div>
          <Button
            onClick={() => {
              setFormStatus('');
              setAssignOpen(true);
            }}
          >
            Assign goal
          </Button>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {completionByStaff.length === 0 ? (
            <Card>
              <p className="text-slate-300">No goals match the current filters.</p>
            </Card>
          ) : (
            completionByStaff.map((entry) => (
              <Card key={entry.id} className="space-y-2">
                <p className="text-sm font-semibold">{entry.name}</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: `${entry.rate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{entry.rate}%</span>
                </div>
                <p className="text-xs text-slate-400">
                  {entry.completed}/{entry.total} completed
                </p>
              </Card>
            ))
          )}
        </section>

        <Card>
          <div className="grid gap-3 md:grid-cols-5">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="staff">
              Staff
              <select
                id="staff"
                value={staffFilter}
                onChange={(event) => setStaffFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All staff</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="office">
              Office
              <select
                id="office"
                value={officeFilter}
                onChange={(event) => setOfficeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All offices</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="type">
              Type
              <select
                id="type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All types</option>
                {goalTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="priority">
              Priority
              <select
                id="priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All priorities</option>
                {goalPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {titleCase(priority)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="status">
              Status
              <select
                id="status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All statuses</option>
                {goalStatuses.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <section className="grid gap-3">
          {goals.length === 0 ? (
            <Card>
              <p className="text-slate-300">No goals found.</p>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className={`border-l-4 ${priorityAccent[goal.priority]}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[goal.priority]}`}
                      >
                        {titleCase(goal.priority)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[goal.status]}`}
                      >
                        {titleCase(goal.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {staffName(goal.user_id)} · {titleCase(goal.goal_type)}
                      {goal.due_date
                        ? ` · due ${format(parseISO(goal.due_date), 'MMM d, yyyy')}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFormStatus('');
                        setEditing(goal);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(goal)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>

      {assignOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Assign goal</h2>
            <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleAssign}>
              <label
                className="space-y-2 text-sm text-slate-200 md:col-span-2"
                htmlFor="assign_title"
              >
                Title
                <Input id="assign_title" name="title" required />
              </label>
              <label
                className="space-y-2 text-sm text-slate-200 md:col-span-2"
                htmlFor="assign_description"
              >
                Description
                <textarea id="assign_description" name="description" className={selectClass} />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="assign_user">
                Staff
                <select id="assign_user" name="user_id" className={selectClass} required>
                  <option value="">Select staff</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="assign_type">
                Type
                <select id="assign_type" name="goal_type" className={selectClass} required>
                  {goalTypes.map((type) => (
                    <option key={type} value={type}>
                      {titleCase(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="assign_priority">
                Priority
                <select
                  id="assign_priority"
                  name="priority"
                  defaultValue="medium"
                  className={selectClass}
                >
                  {goalPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {titleCase(priority)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="assign_due">
                Due date
                <Input id="assign_due" name="due_date" type="date" />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="assign_reminder">
                Reminder time
                <Input id="assign_reminder" name="reminder_time" type="time" />
              </label>
              <div className="flex items-center justify-end gap-3 md:col-span-2">
                {formStatus ? <p className="mr-auto text-sm text-red-300">{formStatus}</p> : null}
                <Button type="button" variant="ghost" onClick={() => setAssignOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Assigning…' : 'Assign goal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Edit goal</h2>
            <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleEdit}>
              <label
                className="space-y-2 text-sm text-slate-200 md:col-span-2"
                htmlFor="edit_title"
              >
                Title
                <Input id="edit_title" name="title" defaultValue={editing.title} required />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_priority">
                Priority
                <select
                  id="edit_priority"
                  name="priority"
                  defaultValue={editing.priority}
                  className={selectClass}
                >
                  {goalPriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {titleCase(priority)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_status">
                Status
                <select
                  id="edit_status"
                  name="status"
                  defaultValue={editing.status}
                  className={selectClass}
                >
                  {goalStatuses.map((status) => (
                    <option key={status} value={status}>
                      {titleCase(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_due">
                Due date
                <Input
                  id="edit_due"
                  name="due_date"
                  type="date"
                  defaultValue={editing.due_date ?? ''}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_reminder">
                Reminder time
                <Input
                  id="edit_reminder"
                  name="reminder_time"
                  type="time"
                  defaultValue={editing.reminder_time ? editing.reminder_time.slice(0, 5) : ''}
                />
              </label>
              <label
                className="space-y-2 text-sm text-slate-200 md:col-span-2"
                htmlFor="edit_notes"
              >
                Completion notes (required when marking completed)
                <textarea id="edit_notes" name="completion_notes" className={selectClass} />
              </label>
              <div className="flex items-center justify-end gap-3 md:col-span-2">
                {formStatus ? <p className="mr-auto text-sm text-red-300">{formStatus}</p> : null}
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
