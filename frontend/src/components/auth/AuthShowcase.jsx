import { cn } from '@/lib/utils';

export default function AuthShowcase({
  eyebrow,
  title,
  description,
  stats = [],
  highlights = [],
  bottomCard,
  className,
}) {
  return (
    <div className={cn('w-full max-w-2xl', className)}>
      <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
        {eyebrow}
      </div>
      <h2 className="mt-6 max-w-xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{description}</p>

      {stats.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">{item.label}</div>
              <div className="mt-3 text-3xl font-heading font-extrabold text-white">{item.value}</div>
              {item.detail ? <p className="mt-3 text-sm leading-6 text-white/68">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div className="mt-8 grid gap-3">
          {highlights.map((item) => (
            <div key={item} className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 px-5 py-4 text-sm leading-6 text-white/78">
              {item}
            </div>
          ))}
        </div>
      ) : null}

      {bottomCard ? <div className="mt-8">{bottomCard}</div> : null}
    </div>
  );
}
