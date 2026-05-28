import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function StaffProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">My profile</p>
          <h1 className="mt-2 text-3xl font-semibold">Staff self-service profile</h1>
          <p className="mt-2 text-slate-300">
            Update contact details, view achievement progress, and keep your profile current.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <h2 className="text-xl font-semibold">Profile information</h2>
            <div className="mt-6 space-y-4">
              <Input defaultValue="Ashok Sudam Patil Devarde" />
              <Input defaultValue="ashok@abhaedu.in" />
              <Input defaultValue="+91 9876543210" />
              <Input defaultValue="Office Manager" />
              <div className="flex gap-3">
                <Button>Save changes</Button>
                <Button variant="ghost">Reset</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Achievement progress</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                This month: 14 achievements
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Target: 18</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Bonus status: Eligible
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
