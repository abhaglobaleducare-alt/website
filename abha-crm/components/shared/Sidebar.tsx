import Link from 'next/link';

export function Sidebar({
  items,
  title,
}: {
  items: { label: string; href: string }[];
  title: string;
}) {
  return (
    <aside className="hidden w-72 rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-soft backdrop-blur-md lg:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-saffron/15" />
        <div>
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-300">ABHA CRM</p>
        </div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl border border-transparent px-4 py-3 text-sm text-slate-200 transition hover:border-saffron/30 hover:bg-saffron/10"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
