import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Layers3,
  MessageSquareText,
  Radar,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import BrandLogo from '../components/BrandLogo';
import SectionShell from '../components/marketing/SectionShell';
import SectionHeading from '../components/marketing/SectionHeading';
import MetricCard from '../components/marketing/MetricCard';
import FeatureCard from '../components/marketing/FeatureCard';
import ProofStrip from '../components/marketing/ProofStrip';

const proofItems = [
  { value: '3.2x', label: 'faster shortlist creation', detail: 'AI-assisted screening compresses the top-of-funnel workload.' },
  { value: '92%', label: 'profile-match confidence', detail: 'Signals combine skills, intent, role fit, and recruiter priorities.' },
  { value: '<24h', label: 'average response loop', detail: 'Shared messaging and status visibility keep candidates informed.' },
  { value: '1 hub', label: 'for every hiring team', detail: 'Sourcing, pipeline updates, messaging, and analytics in one workspace.' },
];

const featureItems = [
  {
    icon: Sparkles,
    title: 'AI candidate matching',
    description: 'Surface best-fit candidates and opportunities using skills, experience, and behavioral intent signals.',
  },
  {
    icon: MessageSquareText,
    title: 'Shared hiring communication',
    description: 'Keep recruiters and candidates aligned with real-time messaging, status updates, and transparent next steps.',
  },
  {
    icon: Layers3,
    title: 'Structured hiring workflows',
    description: 'Move from sourcing to shortlist to decision in one consistent operating system for your team.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-grade trust',
    description: 'High-clarity dashboards, audit-friendly views, and role-based workflows designed for scale.',
  },
];

const recruiterBenefits = [
  'Launch roles faster with reusable job publishing workflows.',
  'Prioritize talent with AI recommendations and pipeline visibility.',
  'Keep teams aligned with messaging, shortlist status, and shared context.',
];

const candidateBenefits = [
  'Discover roles matched to skills, experience, and intent.',
  'Track applications and recruiter feedback in one clear timeline.',
  'Stay close to opportunities with simple, fast communication.',
];

const workflowSteps = [
  {
    title: 'Capture role intent',
    description: 'Recruiters define what success looks like once, then Naya Job carries those signals through the funnel.',
  },
  {
    title: 'Rank and qualify talent',
    description: 'Candidates are surfaced with fit signals, skill alignment, and next-best actions for the hiring team.',
  },
  {
    title: 'Move from contact to conversion',
    description: 'Messaging, applications, and status updates stay connected so nobody loses context.',
  },
];

const platformModules = [
  {
    icon: Building2,
    title: 'Recruiter workspace',
    description: 'A structured command center for publishing roles, reviewing applicants, messaging candidates, and tracking plan capacity.',
  },
  {
    icon: Users2,
    title: 'Candidate workspace',
    description: 'A cleaner search and application experience with profile-driven recommendations, transparent status, and recruiter messaging.',
  },
  {
    icon: ShieldCheck,
    title: 'Operational governance',
    description: 'Approvals, visibility, and shared system rules help teams scale without letting the hiring process become chaotic.',
  },
];

const clarityPoints = [
  'Light-first enterprise UI with selective premium dark surfaces for focus and trust.',
  'Shared design system across recruiter, candidate, and platform workflows.',
  'Calm data density that feels operational without becoming heavy or cluttered.',
];

const faqItems = [
  {
    question: 'Who is Naya Job built for?',
    answer: 'Naya Job is designed for both sides of the recruitment market: recruiters who need a structured hiring operating system, and candidates who want a cleaner, more transparent experience.',
  },
  {
    question: 'What makes it feel more premium than a basic job board?',
    answer: 'The platform combines AI-assisted matching, clearer workflow visibility, shared messaging, and enterprise-grade consistency across every major page instead of treating hiring like a list of disconnected forms.',
  },
  {
    question: 'Can the system scale with larger hiring teams?',
    answer: 'Yes. The product direction is built around reusable workflows, role-based experiences, and a shared app shell that supports more complex recruiter operations over time.',
  },
];

const testimonialItems = [
  {
    quote: 'Naya Job feels like a real hiring operating system instead of another job board.',
    name: 'Aarav Malhotra',
    role: 'Head of Talent Acquisition',
  },
  {
    quote: 'The experience is fast, clear, and premium for both recruiters and candidates.',
    name: 'Naina Kapoor',
    role: 'People Operations Lead',
  },
  {
    quote: 'The UI finally looks like software our leadership team would trust at enterprise scale.',
    name: 'Ritika Sharma',
    role: 'VP, Recruiting Programs',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="section-container flex h-20 items-center justify-between">
          <BrandLogo linked showWordmark tone="dark" size="md" />

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 md:flex">
            <a href="#capabilities">
              <Button variant="nav" className="text-white/80 hover:bg-white/10 hover:text-white">
                Capabilities
              </Button>
            </a>
            <a href="#workflow">
              <Button variant="nav" className="text-white/80 hover:bg-white/10 hover:text-white">
                Workflow
              </Button>
            </a>
            <a href="#trust">
              <Button variant="nav" className="text-white/80 hover:bg-white/10 hover:text-white">
                Trust
              </Button>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white/90 hover:bg-white/10 hover:text-white" data-testid="header-login-btn">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="accent" size="lg" className="hidden sm:inline-flex" data-testid="header-register-btn">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-grid relative isolate overflow-hidden pb-20 pt-14 text-white sm:pb-24 sm:pt-16">
        <div className="ambient-orb left-[-5rem] top-16 h-44 w-44 bg-fuchsia-500/50" />
        <div className="ambient-orb bottom-4 right-8 h-52 w-52 bg-sky-400/25" />

        <div className="section-container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl motion-safe-rise">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Executive AI recruitment platform
              </div>
              <h1 className="mt-7 max-w-4xl text-5xl font-heading font-extrabold tracking-[-0.05em] text-balance text-white sm:text-6xl xl:text-7xl">
                A premium hiring experience for modern recruiters and ambitious talent.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Naya Job brings AI matching, pipeline clarity, candidate communication, and recruiter workflows into one professional platform built to scale.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/register">
                  <Button variant="accent" size="xl" className="w-full sm:w-auto" data-testid="hero-get-started-btn">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full border-white/20 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/10 sm:w-auto"
                    data-testid="hero-browse-jobs-btn"
                  >
                    Browse Opportunities
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3 text-white">
                    <Bot className="h-5 w-5 text-violet-300" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">AI rankers</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Smart matching and shortlist prioritization for every role.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3 text-white">
                    <Radar className="h-5 w-5 text-cyan-300" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Live pipeline</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Shared status and recruitment visibility without spreadsheet drift.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3 text-white">
                    <MessageSquareText className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Unified comms</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Candidate and recruiter conversations stay tied to real workflow context.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative motion-safe-rise">
              <div className="premium-panel-strong subtle-grid relative overflow-hidden p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.08] px-4 py-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Hiring command center</div>
                    <div className="mt-1 text-lg font-heading font-bold text-white">Naya Job Intelligence</div>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Live
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Role focus</div>
                        <div className="mt-2 text-xl font-heading font-bold text-white">Senior Product Designer</div>
                      </div>
                      <div className="feature-icon border-white/10 bg-violet-400/10 text-violet-200">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">AI shortlist quality</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">Top candidates ready</div>
                          </div>
                          <div className="text-2xl font-heading font-extrabold text-violet-200">87%</div>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div className="h-2 w-[87%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-4">
                          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Qualified this week</div>
                          <div className="mt-2 text-3xl font-heading font-extrabold text-white">142</div>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-4">
                          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Median response</div>
                          <div className="mt-2 text-3xl font-heading font-extrabold text-white">6h</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
                      <div className="flex items-center gap-3">
                        <Users2 className="h-5 w-5 text-cyan-300" />
                        <div>
                          <div className="text-sm font-semibold text-white">Recruiter panel</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Pipeline clarity</div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-white/70">
                        <div className="flex items-center justify-between">
                          <span>New matches</span>
                          <span className="font-semibold text-white">24</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Interview-ready</span>
                          <span className="font-semibold text-white">9</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Awaiting response</span>
                          <span className="font-semibold text-white">4</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-emerald-300" />
                        <div>
                          <div className="text-sm font-semibold text-white">Candidate experience</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Transparent progress</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-white/80">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        Application status updates delivered in one clear timeline.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ProofStrip items={proofItems} />
          </div>
        </div>
      </section>

      <SectionShell id="capabilities" className="bg-background">
        <SectionHeading
          align="center"
          eyebrow="Platform capabilities"
          title="Built like enterprise software, designed for human hiring."
          description="Every workflow is organized around better fit, faster decisions, and a cleaner experience for recruiters and candidates alike."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureItems.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-background pt-0">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Platform structure"
              title="One brand system across every hiring workflow."
              description="Naya Job should feel consistent from the first visit through daily recruiter operations. The product is structured as one professional system, not a set of unrelated pages."
            />

            <div className="mt-8 space-y-4">
              {clarityPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-7">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-1">
            {platformModules.map((module) => (
              <div key={module.title} className="premium-panel p-6">
                <div className="feature-icon">
                  <module.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-surface-subtle">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="premium-panel p-8 sm:p-10">
            <div className="section-eyebrow">For recruiters</div>
            <h3 className="mt-5 text-3xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
              Hire with more signal and less noise.
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Treat every open role like a managed funnel with AI support, shared visibility, and cleaner decision-making.
            </p>
            <div className="mt-8 space-y-4">
              {recruiterBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-7">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-panel p-8 sm:p-10">
            <div className="section-eyebrow">For candidates</div>
            <h3 className="mt-5 text-3xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
              Find opportunities that actually fit.
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Naya Job gives job seekers a faster, more transparent path from discovery to application to conversation.
            </p>
            <div className="mt-8 space-y-4">
              {candidateBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-7">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="workflow" className="bg-background">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Workflow intelligence"
              title="One operating rhythm from sourcing to signed offer."
              description="The platform is structured to remove handoff friction. Everyone sees the same truth, with AI helping teams focus attention where it matters."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MetricCard value="4.8/5" label="candidate clarity score" detail="Cleaner messaging and visible progress reduce ambiguity for applicants." />
              <MetricCard value="68%" label="shortlist conversion lift" detail="Teams move qualified candidates forward faster with less manual review." />
            </div>
          </div>

          <div className="premium-panel overflow-hidden p-6 sm:p-8">
            <div className="grid gap-4">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-heading font-extrabold text-white">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-accent/20 bg-accent/10 px-5 py-4 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-accent" />
                AI recommendations stay embedded in the workflow instead of becoming a separate tool.
              </div>
              <ChevronRight className="hidden h-5 w-5 text-accent sm:block" />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="bg-background pt-0">
        <div className="premium-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Product experience"
                title="Designed to feel sharp in every mode of work."
                description="Landing, authentication, candidate workflows, recruiter workflows, and platform management all follow the same visual logic so the product feels credible at every step."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard value="Light-first" label="core workspace" detail="Readable, operational, and trustworthy for long sessions." />
              <MetricCard value="Dark accent" label="premium moments" detail="Used selectively for hero areas, AI surfaces, and emphasis." />
              <MetricCard value="1 system" label="shared components" detail="Reusable patterns keep the whole platform consistent as it grows." />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="trust" className="bg-surface-subtle">
        <SectionHeading
          align="center"
          eyebrow="Why it feels premium"
          title="Trust, clarity, and consistency across the platform."
          description="A serious hiring product needs executive polish, calm data density, and a candidate experience that feels respectful at every step."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonialItems.map((item) => (
            <div key={item.name} className="premium-panel h-full p-8">
              <div className="flex items-center gap-3 text-accent">
                <Building2 className="h-5 w-5" />
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-700">"{item.quote}"</p>
              <div className="mt-8 border-t border-slate-200 pt-5">
                <div className="font-semibold text-slate-950">{item.name}</div>
                <div className="text-sm text-slate-500">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="bg-background pt-0">
        <SectionHeading
          align="center"
          eyebrow="Common questions"
          title="What teams usually want to know before they trust the platform."
          description="The landing page should answer the big product questions quickly and clearly, especially for decision-makers evaluating a premium recruitment platform."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {faqItems.map((item) => (
            <div key={item.question} className="premium-panel h-full p-7">
              <h3 className="text-xl font-heading font-bold text-slate-950">{item.question}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pb-20 pt-4">
        <div className="premium-panel-strong hero-mesh overflow-hidden p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="section-eyebrow border-white/10 bg-white/10 text-white">Ready to modernize hiring</div>
              <h2 className="mt-5 text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Bring a world-class recruitment experience to both sides of the market.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Start with Naya Job and give recruiters a sharper system while giving candidates a cleaner, more confident journey.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/register">
                <Button variant="accent" size="xl" className="w-full" data-testid="cta-register-btn">
                  Get Started
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="xl" className="w-full border-white/20 bg-white/[0.06] text-white hover:bg-white/10">
                  Explore Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionShell>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="section-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BrandLogo showWordmark linked size="sm" />
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              AI-powered recruitment software for premium candidate discovery, recruiter workflows, and hiring clarity.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-slate-950">Capabilities</a>
            <a href="#workflow" className="hover:text-slate-950">Workflow</a>
            <Link to="/jobs" className="hover:text-slate-950">Jobs</Link>
            <Link to="/login" className="hover:text-slate-950">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
