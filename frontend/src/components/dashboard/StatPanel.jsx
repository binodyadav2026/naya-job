import { cn } from '@/lib/utils';

export default function StatPanel({
  icon: Icon,
  label,
  value,
  detail,
  valueClassName,
  className,
}) {
  return (
    <div className={cn('premium-panel p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
          <div className={cn('mt-3 text-4xl font-heading font-extrabold tracking-[-0.04em] text-slate-950', valueClassName)}>
            {value}
          </div>
          {detail ? <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p> : null}
        </div>
        {Icon ? (
          <div className="feature-icon h-12 w-12 shrink-0 rounded-2xl">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
