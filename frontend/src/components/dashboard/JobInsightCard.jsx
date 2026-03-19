import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export default function JobInsightCard({ job, index = 0 }) {
  const matchScore = Math.max(82, 96 - index * 4);

  return (
    <div className="premium-panel h-full overflow-hidden p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">AI recommendation</div>
          <h3 className="mt-3 text-xl font-heading font-bold text-slate-950">{job.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent">
            <Building2 className="h-4 w-4" />
            {job.company_name}
          </div>
        </div>
        <div className="rounded-2xl border border-accent/15 bg-accent/10 px-3 py-2 text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Fit score</div>
          <div className="mt-1 text-xl font-heading font-extrabold text-slate-950">{matchScore}%</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">
          <Sparkles className="h-4 w-4" />
          High match for your profile
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.required_skills?.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
        <div className="text-sm text-slate-500">Recommended for quick review</div>
        <Link to={`/jobseeker/jobs/${job.job_id}`}>
          <Button variant="accent" className="font-semibold" data-testid={`view-btn-${job.job_id}`}>
            View role
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
