import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquareText,
  Radar,
  Sparkles,
  Users2,
} from 'lucide-react';

const roleContent = {
  job_seeker: {
    eyebrow: 'Job seeker mode',
    title: 'Build a confident candidate journey from profile to offer.',
    description:
      'Create an account tailored to discover relevant roles, track applications clearly, and stay close to every recruiter interaction.',
    label: 'Candidate experience',
    accent: 'from-cyan-400/30 via-violet-500/20 to-fuchsia-500/20',
    stats: [
      { label: 'Matched roles', value: '48', detail: 'AI-ranked opportunities aligned with profile and intent.' },
      { label: 'Response visibility', value: 'Live', detail: 'Application status stays visible in one timeline.' },
    ],
    bullets: [
      'Personalized job discovery',
      'Application tracking in one place',
      'Simple recruiter communication',
    ],
    icon: Sparkles,
    sideIcon: MessageSquareText,
  },
  recruiter: {
    eyebrow: 'Recruiter mode',
    title: 'Set up a workspace built for faster hiring decisions.',
    description:
      'Create a recruiter account to publish roles, review AI-assisted matches, and manage hiring activity with a cleaner system.',
    label: 'Recruiter intelligence',
    accent: 'from-violet-500/30 via-fuchsia-500/20 to-sky-400/20',
    stats: [
      { label: 'Shortlist speed', value: '3.2x', detail: 'Move faster from role creation to qualified candidate review.' },
      { label: 'Pipeline signal', value: '92%', detail: 'Shared visibility and fit-based ranking for each role.' },
    ],
    bullets: [
      'Structured job publishing',
      'AI-assisted candidate ranking',
      'Pipeline and message visibility',
    ],
    icon: Radar,
    sideIcon: Users2,
  },
};

export default function RoleShowcase({ role }) {
  const content = roleContent[role] || roleContent.job_seeker;
  const PrimaryIcon = content.icon;
  const SideIcon = content.sideIcon;

  return (
    <div
      key={role}
      className="auth-panel-enter relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-md"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${content.accent}`} />
      <div className="absolute right-6 top-6 rounded-2xl border border-white/10 bg-white/10 p-3 text-white">
        <PrimaryIcon className="h-6 w-6" />
      </div>

      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{content.eyebrow}</div>
        <h3 className="mt-4 max-w-lg text-3xl font-heading font-extrabold tracking-[-0.04em] text-white">
          {content.title}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{content.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {content.stats.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">{item.label}</div>
              <div className="mt-2 text-3xl font-heading font-extrabold text-white">{item.value}</div>
              <p className="mt-2 text-sm leading-6 text-white/68">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white">
              <SideIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{content.label}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">What this account unlocks</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {content.bullets.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-slate-950/40 px-4 py-3 text-sm text-white/78">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-[1.25rem] border border-violet-300/15 bg-violet-300/10 px-4 py-3 text-sm text-white/82">
          <Bot className="h-4 w-4 shrink-0 text-violet-200" />
          The interface adapts to the role you choose while staying inside the same premium Naya Job system.
        </div>
      </div>
    </div>
  );
}
