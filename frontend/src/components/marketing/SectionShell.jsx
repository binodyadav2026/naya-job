import { cn } from '@/lib/utils';

export default function SectionShell({
  id,
  className,
  containerClassName,
  children,
}) {
  return (
    <section id={id} className={cn('section-shell', className)}>
      <div className={cn('section-container', containerClassName)}>{children}</div>
    </section>
  );
}
