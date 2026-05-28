import { Button } from '../ui/button';
import { Logo } from './Logo';

export function Header({
  title,
  subtitle,
  userName,
}: {
  title: string;
  subtitle?: string;
  userName?: string;
}) {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-soft backdrop-blur-md">
      <div>
        <Logo className="mb-2" />
        <p className="text-xs uppercase tracking-[0.35em] text-saffron">{title}</p>
        {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {userName ? (
          <span className="hidden rounded-full border border-saffron/30 bg-saffron/10 px-3 py-2 text-sm text-slate-100 md:block">
            {userName}
          </span>
        ) : null}
        <Button variant="ghost" type="button">
          Logout
        </Button>
      </div>
    </header>
  );
}
