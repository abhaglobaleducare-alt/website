import Link from 'next/link';

export function MobileNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/95 p-3 lg:hidden">
      <div className="mx-auto flex max-w-md justify-around gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-3 py-2 text-center text-xs text-slate-200 hover:bg-saffron/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
