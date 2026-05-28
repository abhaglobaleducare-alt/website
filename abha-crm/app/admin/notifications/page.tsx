'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  notificationTypes,
  notificationTypeLabel,
  notificationTypeClasses,
} from '../../../lib/constants/admin';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at?: string | null;
  user?: { full_name?: string | null } | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [typeFilter, setTypeFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    if (readFilter) params.set('is_read', readFilter);
    fetch(`/api/notifications?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setNotifications(json.notifications ?? []);
        setUnread(json.unread ?? 0);
      })
      .catch(() => setNotifications([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, readFilter]);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    });
    load();
  };

  const broadcast = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    const form = event.currentTarget;
    const fd = new FormData(form);
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: String(fd.get('title') ?? '').trim(),
        message: String(fd.get('message') ?? '').trim(),
        type: String(fd.get('type') ?? 'admin_alert'),
      }),
    });
    const json = await res.json();
    setStatus(
      json.ok ? `Broadcast sent to ${json.sent} staff.` : (json.error ?? 'Broadcast failed.'),
    );
    if (json.ok) {
      form.reset();
      load();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin · Notifications</p>
            <h1 className="mt-2 text-3xl font-semibold">Notifications center</h1>
            <p className="mt-2 text-slate-300">{unread} unread</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={markAllRead}>
              Mark all read
            </Button>
            <Link href="/admin/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </header>

        <Card>
          <h2 className="text-lg font-semibold">Send broadcast to all staff</h2>
          {status ? <p className="mt-2 text-sm text-emerald-200">{status}</p> : null}
          <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={broadcast}>
            <Input name="title" placeholder="Title" required />
            <select name="type" defaultValue="admin_alert" className={selectClass}>
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <textarea
              name="message"
              required
              placeholder="Message"
              className="min-h-[70px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron md:col-span-2"
            />
            <div className="md:col-span-2">
              <Button type="submit" size="sm">
                Send broadcast
              </Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-wrap gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
          >
            <option value="">All types</option>
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
          >
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        <section className="grid gap-3">
          {notifications.length === 0 ? (
            <Card>
              <p className="text-slate-300">No notifications for this filter.</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={notification.is_read ? 'opacity-70' : 'border-l-4 border-l-saffron'}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${notificationTypeClasses[notification.type] ?? 'bg-slate-500/15 text-slate-300'}`}
                      >
                        {notificationTypeLabel(notification.type)}
                      </span>
                      {!notification.is_read ? (
                        <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-xs text-saffron">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      To {notification.user?.full_name ?? 'staff'}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {notification.created_at
                      ? formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })
                      : ''}
                  </span>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
