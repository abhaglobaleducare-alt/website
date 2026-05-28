import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { staffSeed } from '../../../../lib/constants/staff';

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const member = staffSeed.find((item) => item.id === params.id);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Staff profile</p>
            <h1 className="mt-2 text-3xl font-semibold">{member.name}</h1>
            <p className="mt-2 text-slate-300">
              Role: {member.role} • Office: {member.office}
            </p>
          </div>
          <Link href="/admin/staff">
            <Button variant="ghost">Back to list</Button>
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="text-xl font-semibold">Profile overview</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Email: {member.email}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Phone: {member.phone}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Designation: {member.designation}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Salary: ₹{member.salary.toLocaleString()}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Bonus: ₹{member.bonus.toLocaleString()}
              </p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Achievements: {member.achievements}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Edit staff record</h2>
            <div className="mt-6 space-y-4">
              <Input defaultValue={member.name} />
              <Input defaultValue={member.email} />
              <Input defaultValue={member.phone} />
              <Input defaultValue={member.designation} />
              <div className="flex gap-3">
                <Button>Save changes</Button>
                <Button variant="ghost">Reset</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
