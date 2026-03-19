import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users2,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Subscription', path: '/recruiter/subscription', icon: CreditCard },
];

const statusToneMap = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function RecruiterDashboard() {
  const { user } = useOutletContext();
  const [stats, setStats] = useState({
    subscription_plan: 'free',
    subscription_status: 'inactive',
    subscription_end: null,
    jobs_posted_this_month: 0,
    custom_job_limit: null,
    jobs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        api.get(`/profile/recruiter/${user.user_id}`),
        api.get('/jobs/recruiter/my-jobs'),
      ]);
      setStats({
        subscription_plan: profileRes.data.subscription_plan || 'free',
        subscription_status: profileRes.data.subscription_status || 'inactive',
        subscription_end: profileRes.data.subscription_end,
        jobs_posted_this_month: profileRes.data.jobs_posted_this_month || 0,
        custom_job_limit: profileRes.data.custom_job_limit,
        jobs: jobsRes.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyLimit =
    stats.custom_job_limit ||
    (stats.subscription_plan === 'free'
      ? 1
      : stats.subscription_plan === 'basic'
      ? 10
      : stats.subscription_plan === 'premium'
      ? 50
      : stats.subscription_plan === 'enterprise'
      ? 'Unlimited'
      : '?');

  const approvedJobs = stats.jobs.filter((job) => job.status === 'approved').length;
  const pendingJobs = stats.jobs.filter((job) => job.status === 'pending').length;
  const responseMomentum = stats.jobs.length
    ? Math.round((approvedJobs / stats.jobs.length) * 100)
    : 0;

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="recruiter-dashboard">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Hiring operations workspace
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Recruit with a calmer, sharper operating system.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Publish roles, monitor approval status, and move candidates through the funnel with more structure and less friction.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/recruiter/post-job">
                  <Button variant="accent" size="xl" className="w-full sm:w-auto">
                    Post a new job
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/recruiter/my-jobs">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full border-white/20 bg-white/[0.06] text-white hover:bg-white/10 sm:w-auto"
                  >
                    Manage open roles
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/50">Approval momentum</div>
                    <div className="mt-3 text-4xl font-heading font-extrabold text-white">{responseMomentum}%</div>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Based on how many of your active jobs are already approved and live.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400"
                    style={{ width: `${Math.max(responseMomentum, 12)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Live jobs</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{approvedJobs}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Plan status</div>
                <div className="mt-3 text-3xl font-heading font-extrabold capitalize text-white">{stats.subscription_plan}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <StatPanel
            icon={CreditCard}
            label="Current plan"
            value={stats.subscription_plan}
            detail={stats.subscription_status === 'active' ? 'Subscription is active and ready for hiring operations.' : 'Upgrade or activate your plan to scale hiring faster.'}
            valueClassName="capitalize text-violet-600"
          />
          <StatPanel
            icon={ShieldCheck}
            label="Subscription"
            value={stats.subscription_status === 'active' ? 'Active' : 'Inactive'}
            detail={stats.subscription_end && stats.subscription_status === 'active' ? `Valid until ${new Date(stats.subscription_end).toLocaleDateString()}` : 'Plan activation status is currently inactive.'}
            valueClassName={stats.subscription_status === 'active' ? 'text-emerald-500' : 'text-amber-500'}
          />
          <StatPanel
            icon={Briefcase}
            label="Jobs this month"
            value={`${stats.jobs_posted_this_month}/${monthlyLimit}`}
            detail="Posted this month versus the current plan limit."
          />
          <StatPanel
            icon={Users2}
            label="Total roles"
            value={stats.jobs.length}
            detail={pendingJobs > 0 ? `${pendingJobs} role${pendingJobs > 1 ? 's' : ''} currently waiting for approval.` : 'All current roles are either live or closed.'}
          />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <DashboardSectionHeader
              eyebrow="Recent jobs"
              title="Your most important open roles"
              description="A cleaner view of your latest postings, statuses, and next actions."
              className="sm:px-1"
              action={(
                <Link to="/recruiter/my-jobs">
                  <Button variant="outline">View all jobs</Button>
                </Link>
              )}
            />

            {loading ? (
              <div className="premium-panel flex min-h-[240px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-accent"></div>
              </div>
            ) : stats.jobs.length > 0 ? (
              <div className="grid gap-5">
                {stats.jobs.slice(0, 3).map((job) => (
                  <div key={job.job_id} className="premium-panel p-6 sm:p-7">
                    <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusToneMap[job.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {job.status}
                          </span>
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {job.job_type?.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                          {job.title}
                        </h3>
                        <p className="mt-3 text-sm font-medium text-slate-600">{job.location}</p>
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{job.description}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {job.required_skills?.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 xl:min-w-[220px]">
                        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Posted</div>
                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {new Date(job.posted_at).toLocaleDateString()}
                          </div>
                        </div>

                        {job.status === 'approved' ? (
                          <Link to={`/recruiter/applicants/${job.job_id}`}>
                            <Button variant="accent" className="w-full">
                              View applicants
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Awaiting review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="premium-panel p-8 sm:p-10">
                <div className="max-w-xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No roles yet</div>
                  <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                    Start building your hiring pipeline with your first role.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                    Once you publish jobs, this area becomes your operational summary for approvals, applicants, and recruiting momentum.
                  </p>
                  <Link to="/recruiter/post-job">
                    <Button variant="accent" className="mt-6">
                      Post your first job
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DashboardSectionHeader
              eyebrow="Quick actions"
              title="Move hiring forward"
              description="The highest-value actions recruiters should take from the dashboard."
            />

            <div className="grid gap-5">
              <Link to="/recruiter/post-job">
                <div className="premium-panel p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent/20">
                  <div className="feature-icon">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Post a new role</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Launch a fresh position and get it into the approval and applicant pipeline quickly.
                  </p>
                </div>
              </Link>

              <Link to="/recruiter/subscription">
                <div className="premium-panel p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent/20">
                  <div className="feature-icon">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Manage subscription</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Upgrade plan capacity, monitor limits, and keep your hiring volume aligned with growth.
                  </p>
                </div>
              </Link>

              <div className="premium-panel p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recruiter note</div>
                <div className="mt-3 text-xl font-heading font-bold text-slate-950">Hiring quality beats dashboard clutter.</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This dashboard stays focused on role momentum, plan status, and operational visibility. Detailed hiring records belong on the dedicated pages.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                  <Sparkles className="h-4 w-4" />
                  Executive recruiter workspace
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
