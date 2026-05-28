import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/abha-logo.png"
        alt="ABHA Global Educare"
        width={40}
        height={40}
        className="rounded-xl"
      />
      <div>
        <p className="text-lg font-semibold">ABHA Global Educare</p>
        <p className="text-xs text-slate-300">Staff CRM & Productivity</p>
      </div>
    </div>
  );
}
