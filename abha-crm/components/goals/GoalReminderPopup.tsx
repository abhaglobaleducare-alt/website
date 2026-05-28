'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../ui/button';
import { priorityClasses, titleCase, type GoalPriority } from '../../lib/constants/goals';

interface ReminderGoal {
  id: string;
  title: string;
  priority: GoalPriority;
  due_date?: string | null;
  reminder_time?: string | null;
}

const SNOOZE_MS = 30 * 60 * 1000;
const POLL_MS = 60 * 1000;

export function GoalReminderPopup() {
  const [queue, setQueue] = useState<ReminderGoal[]>([]);
  // Goals already surfaced this session so polling doesn't re-trigger them every minute.
  const seenRef = useRef<Set<string>>(new Set());

  const notify = useCallback((goal: ReminderGoal) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(`Goal reminder: ${goal.title}`, {
        body: `${titleCase(goal.priority)} priority${
          goal.due_date ? ` · due ${goal.due_date}` : ''
        }`,
      });
    }
  }, []);

  const checkReminders = useCallback(async () => {
    try {
      const time = format(new Date(), 'HH:mm');
      const res = await fetch(`/api/goals/reminders?time=${time}`);
      const json = await res.json();
      const due = (json.goals ?? []) as ReminderGoal[];

      const fresh = due.filter((goal) => !seenRef.current.has(goal.id));
      if (fresh.length === 0) return;

      fresh.forEach((goal) => {
        seenRef.current.add(goal.id);
        notify(goal);
      });
      setQueue((prev) => [...prev, ...fresh]);
    } catch {
      // Ignore transient polling failures.
    }
  }, [notify]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => undefined);
      }
    }

    checkReminders();
    const interval = window.setInterval(checkReminders, POLL_MS);
    return () => window.clearInterval(interval);
  }, [checkReminders]);

  const current = queue[0];
  if (!current) return null;

  const dismiss = () => setQueue((prev) => prev.slice(1));

  const markDone = async () => {
    await fetch(`/api/goals/${current.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed',
        completion_notes: 'Marked done from priority reminder.',
      }),
    }).catch(() => undefined);
    dismiss();
  };

  const snooze = () => {
    const goal = current;
    dismiss();
    window.setTimeout(() => {
      setQueue((prev) => [...prev, goal]);
    }, SNOOZE_MS);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-full max-w-sm">
      <div className="rounded-3xl border border-saffron/40 bg-slate-900 p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-saffron">Goal reminder</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{current.title}</h3>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss reminder"
            className="rounded-full bg-white/5 px-2 text-slate-300 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[current.priority]}`}
          >
            {titleCase(current.priority)}
          </span>
          {current.due_date ? (
            <span className="text-slate-300">
              Due {format(parseISO(current.due_date), 'MMM d, yyyy')}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex gap-3">
          <Button size="sm" onClick={markDone}>
            Mark Done
          </Button>
          <Button size="sm" variant="ghost" onClick={snooze}>
            Snooze 30 min
          </Button>
        </div>

        {queue.length > 1 ? (
          <p className="mt-3 text-xs text-slate-400">+{queue.length - 1} more reminder(s)</p>
        ) : null}
      </div>
    </div>
  );
}
