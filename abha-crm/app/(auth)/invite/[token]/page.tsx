'use client';

import { useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Logo } from '../../../../components/shared/Logo';

export default function InvitePage() {
  const params = useParams();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071a37_0%,#0b2545_100%)] px-4 py-10 text-white lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <Card className="w-full space-y-6 p-8">
          <Logo />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-saffron">Invite acceptance</p>
            <h1 className="text-3xl font-semibold">Set up your account</h1>
            <p className="mt-2 text-slate-300">Token: {params.token}</p>
          </div>
          <form className="space-y-4">
            <Input type="text" value="ABHA Staff" readOnly />
            <Input type="email" value="staff@abhaedu.com" readOnly />
            <Input type="password" placeholder="Create a secure password" />
            <Input type="password" placeholder="Confirm your password" />
            <Button type="submit" className="w-full">
              Accept invite
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
