import { cn } from '@/lib/utils';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl', className)}>
      {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
      <h2 className="mt-4 text-3xl font-heading font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p> : null}
    </div>
  );
}
