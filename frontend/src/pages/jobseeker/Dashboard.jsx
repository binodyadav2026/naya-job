import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Home,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';
import JobInsightCard from '../../components/dashboard/JobInsightCard';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

const statusToneMap = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const stageCards = [
  {
    key: 'applied',
    label: 'Applied',
    value: (applications) => applications.length,
    tone: 'bg-slate-50 border-slate-200 text-slate-700',
  },
  {
    key: 'pending',
    label: 'In review',
    value: (applications) => applications.filter((app) => app.status === 'pending').length,
    tone: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    key: 'shortlisted',
    label: 'Shortlisted',
    value: (applications) => applications.filter((app) => app.status === 'shortlisted').length,
    tone: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  {
    key: 'closed',
    label: 'Closed',
    value: (applications) => applications.filter((app) => app.status === 'rejected').length,
    tone: 'bg-rose-50 border-rose-200 text-rose-700',
  },
];

export default function JobSeekerDashboard() {
  const { user } = useOutletContext();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, appsRes] = await Promise.all([
        api.get('/ai/job-recommendations'),
        api.get('/applications/my-applications'),
      ]);
      setRecommendations(recsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const shortlistedApplications = applications.filter((a) => a.status === 'shortlisted').length;
  const rejectionCount = applications.filter((a) => a.status === 'rejected').length;
  const responseRate = totalApplications ? Math.round(((totalApplications - pendingApplications) / totalApplications) * 100) : 0;
  const hasRecommendations = recommendations.length > 0;

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="jobseeker-dashboard">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-10 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-10 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Candidate workspace
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Welcome back, {user.name}. Your job search now feels like a premium operating system.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Track momentum, review smarter recommendations, and keep every application moving with more clarity and less friction.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/jobseeker/search">
                  <Button variant="accent" size="xl" className="w-full sm:w-auto">
                    Explore matched jobs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/jobseeker/profile">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full border-white/20 bg-white/[0.06] text-white hover:bg-white/10 sm:w-auto"
                  >
                    Refine profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Search momentum</div>
                    <div className="mt-3 text-4xl font-heading font-extrabold text-white">{responseRate}%</div>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Based on applications that have already moved beyond the pending stage.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400"
                    style={{ width: `${Math.max(responseRate, 12)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">AI matches waiting</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{recommendations.length}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Applications in motion</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{pendingApplications + shortlistedApplications}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <StatPanel
            icon={BriefcaseBusiness}
            label="Total applications"
            value={totalApplications}
            detail="All opportunities you have actively moved forward."
          />
          <StatPanel
            icon={Clock3}
            label="Pending review"
            value={pendingApplications}
            detail="Applications currently awaiting recruiter action."
            valueClassName="text-amber-500"
          />
          <StatPanel
            icon={Sparkles}
            label="Shortlisted"
            value={shortlistedApplications}
            detail="Roles where your profile has already cleared the first bar."
            valueClassName="text-emerald-500"
          />
          <StatPanel
            icon={TrendingUp}
            label="Response rate"
            value={`${responseRate}%`}
            detail={rejectionCount > 0 ? `${rejectionCount} closed applications help sharpen future matches.` : 'Your response data will improve as you apply to more roles.'}
            valueClassName="text-violet-600"
          />
        </section>

        <section className="space-y-6">
          <DashboardSectionHeader
            eyebrow="AI recommendations"
            title="Recommended opportunities for your next move"
            description="These roles are surfaced based on skills, application behavior, and overall profile fit."
            className="sm:px-1"
            action={(
              <Link to="/jobseeker/search">
                <Button variant="outline">Open job search</Button>
              </Link>
            )}
          />

          {loading ? (
            <div className="premium-panel flex min-h-[240px] items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
            </div>
          ) : hasRecommendations ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {recommendations.slice(0, 4).map((job, index) => (
                <JobInsightCard key={job.job_id} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div className="premium-panel p-8 sm:p-10">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recommendations unavailable</div>
                <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                  Complete your profile to unlock stronger job matches.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Add more profile detail so the recommendation engine can surface roles with better fit and clearer intent.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/jobseeker/profile">
                    <Button variant="accent">
                      Complete profile
                    </Button>
                  </Link>
                  <Link to="/jobseeker/search">
                    <Button variant="outline">
                      Browse all jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <DashboardSectionHeader
            eyebrow="Application overview"
            title="Your search pipeline at a glance"
            description="A compact summary of application momentum and the most recent movement in your job search."
            className="sm:px-1"
            action={(
              <Link to="/jobseeker/applications">
                <Button variant="outline">View all applications</Button>
              </Link>
            )}
          />

          {applications.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="premium-panel p-6 sm:p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pipeline snapshot</div>
                <div className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                  Focus on movement, not manual tracking.
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Your dashboard should highlight search momentum and next actions. The full application record stays in the dedicated applications area.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {stageCards.map((stage) => {
                    const stageValue = stage.value(applications);

                    return (
                      <div
                        key={stage.key}
                        className={`rounded-[1.5rem] border p-4 ${stage.tone}`}
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]">{stage.label}</div>
                        <div className="mt-2 text-3xl font-heading font-extrabold tracking-[-0.04em]">{stageValue}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-accent/15 bg-accent/10 px-5 py-4 text-sm text-slate-700">
                  {pendingApplications > 0
                    ? `${pendingApplications} application${pendingApplications > 1 ? 's are' : ' is'} currently in review. Keep an eye on replies and update your profile to stay competitive.`
                    : 'No applications are currently pending review. This is a good time to apply to fresh roles and build momentum.'}
                </div>
              </div>

              <div className="grid gap-4">
                {applications.slice(0, 2).map((app) => (
                  <div key={app.application_id} className="premium-panel p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recent activity</div>
                        <h3 className="mt-3 text-xl font-heading font-bold text-slate-950">{app.job?.title}</h3>
                        <p className="mt-2 text-sm font-semibold text-accent">{app.job?.company_name}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          statusToneMap[app.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Applied on</div>
                        <div className="mt-2 text-sm font-medium text-slate-700">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="rounded-[1rem] bg-slate-50 px-4 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Current focus</div>
                        <div className="mt-2 text-sm font-medium text-slate-700">
                          {app.status === 'shortlisted'
                            ? 'Prepare for next-stage conversation'
                            : app.status === 'pending'
                            ? 'Wait for recruiter review'
                            : 'Use insights for stronger future applications'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="premium-panel p-8 sm:p-10">
              <div className="max-w-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No applications yet</div>
                <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                  Start building your pipeline with a few strong applications.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Once you start applying, this dashboard will become your central view for progress, replies, and momentum.
                </p>
                <Link to="/jobseeker/search">
                  <Button variant="accent" className="mt-6">
                    Browse jobs
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
