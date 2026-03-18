import { cn } from '@/lib/utils';

export default function DashboardSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow ? (
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</div>
        ) : null}
        <h2 className="mt-2 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
          {title}
        </h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
