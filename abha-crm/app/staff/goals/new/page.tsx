'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { goalTypes, goalPriorities, titleCase } from '../../../../lib/constants/goals';

interface GoalOption {
  id: string;
  title: string;
  goal_type: string;
}

export default function NewGoalPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [parentGoals, setParentGoals] = useState<GoalOption[]>([]);

  useEffect(() => {
    fetch('/api/goals?scope=staff')
      .then((res) => res.json())
      .then((json) => setParentGoals(json.goals ?? []))
      .catch(() => setParentGoals([]));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      goal_type: String(formData.get('goal_type') ?? ''),
      priority: String(formData.get('priority') ?? 'medium'),
      parent_goal_id: String(formData.get('parent_goal_id') ?? '') || null,
      start_date: String(formData.get('start_date') ?? '') || null,
      due_date: String(formData.get('due_date') ?? '') || null,
      reminder_time: String(formData.get('reminder_time') ?? '') || null,
    };

    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus('Goal created successfully. Redirecting…');
      window.setTimeout(() => {
        window.location.href = '/staff/goals';
      }, 800);
    } else {
      setStatus(json.error ?? 'Could not create the goal.');
    }
  };

  const selectClass =
    'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Goal Management</p>
            <h1 className="mt-2 text-3xl font-semibold">New goal</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Set a goal, link it to a parent objective, and schedule a reminder so it never slips.
            </p>
          </div>
          <Link href="/staff/goals">
            <Button variant="ghost">Back to goals</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-xl font-semibold">Goal details</h2>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="title">
              Title
              <Input id="title" name="title" placeholder="Convert 10 leads this month" required />
            </label>

            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                className="min-h-[90px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="What does success look like?"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-200" htmlFor="goal_type">
              Goal type
              <select id="goal_type" name="goal_type" className={selectClass} required>
                {goalTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-200" htmlFor="priority">
              Priority
              <select id="priority" name="priority" defaultValue="medium" className={selectClass}>
                {goalPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {titleCase(priority)}
                  </option>
                ))}
              </select>
            </label>

            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="parent_goal_id"
            >
              Parent goal (optional)
              <select id="parent_goal_id" name="parent_goal_id" className={selectClass}>
                <option value="">No parent — top-level goal</option>
                {parentGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {titleCase(goal.goal_type)} · {goal.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-200" htmlFor="start_date">
              Start date
              <Input id="start_date" name="start_date" type="date" />
            </label>

            <label className="space-y-2 text-sm text-slate-200" htmlFor="due_date">
              Due date
              <Input id="due_date" name="due_date" type="date" />
            </label>

            <label className="space-y-2 text-sm text-slate-200" htmlFor="reminder_time">
              Reminder time
              <Input id="reminder_time" name="reminder_time" type="time" />
            </label>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Create goal'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
