import { cn } from '@/lib/utils';

export default function FeatureCard({ icon: Icon, title, description, className }) {
  return (
    <div className={cn('feature-card', className)}>
      <div className="feature-icon">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
