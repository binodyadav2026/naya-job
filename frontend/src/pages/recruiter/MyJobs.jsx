import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Sparkles,
  User,
  Users2,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';
import api from '../../utils/api';

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

const statusCopyMap = {
  approved: 'Live and available for applicants.',
  pending: 'Waiting for admin approval before going live.',
  rejected: 'Needs revision before this role can be published.',
  closed: 'Closed to new applications.',
};

export default function MyJobs() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/recruiter/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const approved = jobs.filter((job) => job.status === 'approved').length;
    const pending = jobs.filter((job) => job.status === 'pending').length;
    const closed = jobs.filter((job) => job.status === 'closed').length;

    return {
      approved,
      pending,
      closed,
      open: Math.max(approved + pending, 0),
    };
  }, [jobs]);

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="my-jobs">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-6 xl:grid-cols-[1.18fr_0.82fr] xl:items-start">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Role operations center
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-4xl">
                Manage open roles with more clarity.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Review status, monitor active postings, and move into applicants faster from one cleaner workspace.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/recruiter/post-job">
                  <Button variant="accent" className="w-full sm:w-auto">
                    Post a new job
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/recruiter/subscription">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 bg-white/[0.06] text-white hover:bg-white/10 sm:w-auto"
                  >
                    Review plan
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-end">
              <div className="inline-flex min-w-[112px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Approved</span>
                <span className="text-base font-heading font-extrabold text-white">{stats.approved}</span>
              </div>
              <div className="inline-flex min-w-[112px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Pending</span>
                <span className="text-base font-heading font-extrabold text-white">{stats.pending}</span>
              </div>
              <div className="inline-flex min-w-[112px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Closed</span>
                <span className="text-base font-heading font-extrabold text-white">{stats.closed}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <StatPanel
            icon={Briefcase}
            label="All postings"
            value={jobs.length}
            detail="Total roles currently in your recruiter workspace."
          />
          <StatPanel
            icon={Users2}
            label="Live roles"
            value={stats.approved}
            detail="Approved roles actively collecting applications."
            valueClassName="text-emerald-500"
          />
          <StatPanel
            icon={Sparkles}
            label="Pending review"
            value={stats.pending}
            detail="Roles waiting for admin approval before going live."
            valueClassName="text-amber-500"
          />
          <StatPanel
            icon={FileText}
            label="Closed roles"
            value={stats.closed}
            detail="Archived or closed roles kept for visibility and follow-up."
          />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="space-y-6">
            <DashboardSectionHeader
              eyebrow="Job library"
              title="A cleaner view of every active and recent role"
              description="Track status, review role details, and jump into applicants without the clutter of the old layout."
              className="sm:px-1"
              action={(
                <Link to="/recruiter/post-job">
                  <Button variant="accent">Post another job</Button>
                </Link>
              )}
            />

            {loading ? (
              <div className="premium-panel flex min-h-[260px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-accent"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-5">
                {jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="premium-panel p-6 sm:p-7"
                    data-testid={`job-${job.job_id}`}
                  >
                    <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusToneMap[job.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {job.status}
                          </span>
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {(job.job_type || 'role').replace('_', ' ')}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <Link to={`/recruiter/jobs/${job.job_id}`} className="group inline-block">
                              <h3 className="text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950 transition-colors group-hover:text-accent">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {job.location}
                            </div>
                          </div>

                          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Posted</div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">
                              {new Date(job.posted_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{job.description}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {(job.required_skills || []).slice(0, 6).map((skill) => (
                            <span
                              key={`${job.job_id}-${skill}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Role status note</div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {statusCopyMap[job.status] || 'This role is being tracked inside your recruiter workspace.'}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 xl:min-w-[220px]">
                        <Link to={`/recruiter/jobs/${job.job_id}`}>
                          <Button variant="outline" className="w-full">
                            Review details
                          </Button>
                        </Link>

                        {job.status === 'approved' ? (
                          <Link to={`/recruiter/applicants/${job.job_id}`}>
                            <Button variant="accent" className="w-full">
                              View applicants
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Awaiting approval
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
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No job postings yet</div>
                  <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                    Build your recruiting pipeline with the first role.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                    Once you start publishing jobs, this page becomes your central place for status checks, role review, and applicant access.
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
              eyebrow="Recruiter guidance"
              title="Keep your hiring pipeline high-signal"
              description="A premium recruiter workflow stays focused on role quality, clear status, and strong next actions."
            />

            <div className="grid gap-5">
              <div className="premium-panel p-6">
                <div className="feature-icon">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">What belongs here</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This page is for role oversight and applicant access. It should feel cleaner than a spreadsheet and sharper than a basic list.
                </p>
              </div>

              <div className="premium-panel p-6">
                <div className="feature-icon">
                  <Users2 className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Best next step</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Use live roles to jump into applicants quickly, and use pending roles to spot what still needs approval before candidate flow starts.
                </p>
              </div>

              <Link to="/recruiter/post-job">
                <div className="premium-panel p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent/20">
                  <div className="feature-icon">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Open another role</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Add a new position when your current hiring needs expand or a team is ready to scale faster.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
