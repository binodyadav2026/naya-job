import BrandLogo from '../BrandLogo';
import { cn } from '@/lib/utils';

export default function AuthShell({
  aside,
  children,
  title,
  description,
  footer,
  className,
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hero-grid relative overflow-hidden px-6 py-8 text-white sm:px-8 lg:px-12 lg:py-10">
          <div className="ambient-orb left-[-4rem] top-16 h-40 w-40 bg-fuchsia-500/45" />
          <div className="ambient-orb bottom-10 right-[-2rem] h-48 w-48 bg-cyan-400/20" />

          <div className="relative flex h-full flex-col">
            <BrandLogo linked size="md" className="mb-10" />
            <div className="flex flex-1 items-center">{aside}</div>
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className={cn('w-full max-w-xl', className)}>
            <div className="premium-panel overflow-hidden p-6 sm:p-8">
              <div className="mb-8">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Naya Job workspace
                </div>
                <h1 className="mt-5 text-3xl font-heading font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
              </div>

              {children}
            </div>

            {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
