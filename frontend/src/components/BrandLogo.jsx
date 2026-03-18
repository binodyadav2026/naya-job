import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/naya-job-logo.jpeg';

const sizeClasses = {
  sm: {
    wrapper: 'gap-2',
    frame: 'h-8 w-[104px]',
    image: 'h-[194%] w-auto max-w-none object-contain object-center',
    text: 'text-lg',
  },
  md: {
    wrapper: 'gap-3',
    frame: 'h-10 w-[132px]',
    image: 'h-[200%] w-auto max-w-none object-contain object-center',
    text: 'text-xl',
  },
  lg: {
    wrapper: 'gap-3',
    frame: 'h-12 w-[160px]',
    image: 'h-[200%] w-auto max-w-none object-contain object-center',
    text: 'text-2xl',
  },
};

const toneClasses = {
  light: 'text-slate-950',
  dark: 'text-white',
  muted: 'text-slate-700',
};

export default function BrandLogo({
  size = 'md',
  tone = 'light',
  className,
  textClassName,
  linked = false,
  to = '/',
  showWordmark = false,
  imageOnly = true,
  collapsed = false,
}) {
  const config = sizeClasses[size] || sizeClasses.md;
  const collapsedFrameClass =
    size === 'sm' ? 'h-11 w-11 rounded-[1.15rem]' : 'h-12 w-12 rounded-[1.35rem]';
  const content = (
    <div className={cn('inline-flex items-center', config.wrapper, className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-md bg-white/95 ring-1 ring-black/5',
          collapsed ? collapsedFrameClass : config.frame
        )}
      >
        <img
          src={logoImage}
          alt="Naya Job"
          className={cn(
            collapsed
              ? 'h-full w-full object-contain object-center p-1.5'
              : config.image
          )}
        />
      </div>
      {showWordmark && !imageOnly ? (
        <span
          className={cn(
            'font-heading font-extrabold tracking-[-0.04em]',
            config.text,
            toneClasses[tone] || toneClasses.light,
            textClassName
          )}
        >
          Naya Job
        </span>
      ) : null}
    </div>
  );

  if (!linked) {
    return content;
  }

  return (
    <Link to={to} className="inline-flex items-center">
      {content}
    </Link>
  );
}
