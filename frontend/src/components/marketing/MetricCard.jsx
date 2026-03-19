import { cn } from '@/lib/utils';

export default function MetricCard({ value, label, detail, className }) {
  return (
    <div className={cn('premium-panel p-6', className)}>
      <div className="text-3xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">{value}</div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </div>
  );
}
