'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  format,
  parseISO,
  isToday,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  goalTabs,
  goalPriorities,
  priorityClasses,
  priorityAccent,
  statusClasses,
  titleCase,
  type GoalTab,
  type GoalPriority,
  type GoalStatus,
} from '../../../lib/constants/goals';

interface Goal {
  id: string;
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  goal_type: string;
  priority: GoalPriority;
  status: GoalStatus;
  start_date?: string | null;
  due_date?: string | null;
  reminder_time?: string | null;
  completion_notes?: string | null;
}

function inTab(goal: Goal, tab: GoalTab): boolean {
  if (tab === 'all') return true;
  if (!goal.due_date) return false;
  const due = parseISO(goal.due_date);
  const now = new Date();
  switch (tab) {
    case 'today':
      return isToday(due);
    case 'week':
      return isWithinInterval(due, {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      });
    case 'month':
      return isWithinInterval(due, { start: startOfMonth(now), end: endOfMonth(now) });
    case 'quarter':
      return isWithinInterval(due, { start: startOfQuarter(now), end: endOfQuarter(now) });
    case 'year':
      return isWithinInterval(due, { start: startOfYear(now), end: endOfYear(now) });
    default:
      return true;
  }
}

function isOverdue(goal: Goal): boolean {
  if (!goal.due_date) return false;
  if (goal.status === 'completed' || goal.status === 'cancelled') return false;
  return parseISO(goal.due_date) < new Date(new Date().setHours(0, 0, 0, 0));
}

export default function StaffGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<GoalTab>('today');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [view, setView] = useState<'list' | 'hierarchy'>('list');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [completing, setCompleting] = useState<Goal | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadGoals = () => {
    fetch('/api/goals?scope=staff')
      .then((res) => res.json())
      .then((json) => setGoals(json.goals ?? []))
      .catch(() => setGoals([]));
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const childrenByParent = useMemo(() => {
    const map: Record<string, Goal[]> = {};
    goals.forEach((goal) => {
      if (goal.parent_goal_id) {
        (map[goal.parent_goal_id] ??= []).push(goal);
      }
    });
    return map;
  }, [goals]);

  const computeProgress = (goal: Goal): number => {
    const children = childrenByParent[goal.id] ?? [];
    if (children.length === 0) {
      return goal.status === 'completed' ? 100 : 0;
    }
    const done = children.filter((child) => child.status === 'completed').length;
    return Math.round((done / children.length) * 100);
  };

  const visibleGoals = useMemo(() => {
    return goals.filter(
      (goal) => inTab(goal, tab) && (!priorityFilter || goal.priority === priorityFilter),
    );
  }, [goals, tab, priorityFilter]);

  const rootGoals = useMemo(() => {
    const ids = new Set(goals.map((goal) => goal.id));
    return goals.filter((goal) => !goal.parent_goal_id || !ids.has(goal.parent_goal_id));
  }, [goals]);

  const submitCompletion = async () => {
    if (!completing || !notes.trim()) return;
    setSaving(true);
    const response = await fetch(`/api/goals/${completing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed', completion_notes: notes.trim() }),
    });
    const json = await response.json();
    setSaving(false);
    if (json.ok) {
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === completing.id
            ? { ...goal, status: 'completed', completion_notes: notes.trim() }
            : goal,
        ),
      );
      setCompleting(null);
      setNotes('');
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const GoalRow = ({ goal }: { goal: Goal }) => {
    const overdue = isOverdue(goal);
    const progress = computeProgress(goal);

    return (
      <Card className={`border-l-4 ${priorityAccent[goal.priority]}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{goal.title}</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[goal.priority]}`}
              >
                {titleCase(goal.priority)}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {titleCase(goal.goal_type)}
              </span>
            </div>
            {goal.description ? (
              <p className="mt-1 text-sm text-slate-300">{goal.description}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[goal.status]}`}
              >
                {titleCase(goal.status)}
              </span>
              {goal.due_date ? (
                <span className={overdue ? 'font-semibold text-red-400' : 'text-slate-400'}>
                  {overdue ? '⚠ Overdue · ' : 'Due '}
                  {format(parseISO(goal.due_date), 'MMM d, yyyy')}
                </span>
              ) : (
                <span className="text-slate-500">No due date</span>
              )}
              {goal.reminder_time ? (
                <span className="text-slate-400">⏰ {goal.reminder_time.slice(0, 5)}</span>
              ) : null}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-saffron" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-slate-400">{progress}%</span>
            </div>
          </div>
          {goal.status !== 'completed' && goal.status !== 'cancelled' ? (
            <Button
              size="sm"
              onClick={() => {
                setCompleting(goal);
                setNotes('');
              }}
            >
              Mark Complete
            </Button>
          ) : null}
        </div>
      </Card>
    );
  };

  const renderHierarchy = (goal: Goal, depth: number) => {
    const children = childrenByParent[goal.id] ?? [];
    const hasChildren = children.length > 0;
    const isOpen = expanded.has(goal.id);
    const progress = computeProgress(goal);

    return (
      <div key={goal.id} style={{ marginLeft: depth * 20 }} className="space-y-2">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(goal.id)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-xs text-slate-200 hover:bg-white/10"
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            >
              {isOpen ? '−' : '+'}
            </button>
          ) : (
            <span className="h-6 w-6" />
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[goal.priority]}`}
          >
            {titleCase(goal.priority)}
          </span>
          <div className="flex-1">
            <p className="font-semibold">{goal.title}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {titleCase(goal.goal_type)} · {titleCase(goal.status)}
            </p>
          </div>
          <div className="flex w-32 items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-saffron" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
        </div>
        {hasChildren && isOpen ? (
          <div className="space-y-2">
            {children.map((child) => renderHierarchy(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Goal Management</p>
            <h1 className="mt-2 text-3xl font-semibold">My goals</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Track yearly objectives down to daily tasks, with priority-based reminders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-full border border-white/10 bg-slate-950/80 p-1">
              <button
                type="button"
                onClick={() => setView('list')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === 'list' ? 'bg-saffron text-brand-900' : 'text-slate-300'}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView('hierarchy')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === 'hierarchy' ? 'bg-saffron text-brand-900' : 'text-slate-300'}`}
              >
                Hierarchy
              </button>
            </div>
            <Link href="/staff/goals/new">
              <Button>Add goal</Button>
            </Link>
          </div>
        </header>

        {view === 'list' ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {goalTabs.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      tab === item.key
                        ? 'bg-saffron text-brand-900'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
              >
                <option value="">All priorities</option>
                {goalPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {titleCase(priority)}
                  </option>
                ))}
              </select>
            </div>

            <section className="grid gap-3">
              {visibleGoals.length === 0 ? (
                <Card>
                  <p className="text-slate-300">No goals in this view yet.</p>
                </Card>
              ) : (
                visibleGoals.map((goal) => <GoalRow key={goal.id} goal={goal} />)
              )}
            </section>
          </>
        ) : (
          <section className="space-y-3">
            {rootGoals.length === 0 ? (
              <Card>
                <p className="text-slate-300">No goals yet. Add a yearly goal to start a tree.</p>
              </Card>
            ) : (
              rootGoals.map((goal) => renderHierarchy(goal, 0))
            )}
          </section>
        )}
      </div>

      {completing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Complete goal</h2>
            <p className="mt-1 text-sm text-slate-300">{completing.title}</p>
            <label
              className="mt-4 block space-y-2 text-sm text-slate-200"
              htmlFor="completion_notes"
            >
              Completion notes (required)
              <textarea
                id="completion_notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-[110px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="What was achieved? Any outcomes or follow-ups?"
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setCompleting(null);
                  setNotes('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitCompletion} disabled={saving || !notes.trim()}>
                {saving ? 'Saving…' : 'Mark Complete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
