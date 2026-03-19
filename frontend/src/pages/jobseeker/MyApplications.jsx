import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CircleCheckBig,
  Clock3,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

const statusConfig = {
  pending: {
    label: 'In review',
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  shortlisted: {
    label: 'Shortlisted',
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Closed',
    tone: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  accepted: {
    label: 'Accepted',
    tone: 'bg-sky-50 text-sky-700 border-sky-200',
  },
};

export default function MyApplications() {
  const { user } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = applications.length;
  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const shortlistedCount = applications.filter((app) => app.status === 'shortlisted').length;
  const acceptedCount = applications.filter((app) => app.status === 'accepted').length;
  const rejectedCount = applications.filter((app) => app.status === 'rejected').length;

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="my-applications">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Application command center
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Track every application in one premium, high-clarity workspace.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Review status movement, monitor recruiter response, and keep your search organized without spreadsheet-style clutter.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Applications</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{totalApplications}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">In review</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{pendingCount}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Shortlisted</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{shortlistedCount}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Accepted</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{acceptedCount}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <StatPanel
            icon={BriefcaseBusiness}
            label="Total submitted"
            value={totalApplications}
            detail="Every role you have actively applied to."
          />
          <StatPanel
            icon={Clock3}
            label="Awaiting reply"
            value={pendingCount}
            detail="Applications that are still in recruiter review."
            valueClassName="text-amber-500"
          />
          <StatPanel
            icon={CircleCheckBig}
            label="Shortlisted"
            value={shortlistedCount}
            detail="Roles where your profile has already advanced."
            valueClassName="text-emerald-500"
          />
          <StatPanel
            icon={XCircle}
            label="Closed"
            value={rejectedCount}
            detail={acceptedCount > 0 ? `${acceptedCount} accepted role${acceptedCount > 1 ? 's' : ''} already in your pipeline.` : 'Closed roles still sharpen your future targeting.'}
            valueClassName="text-rose-500"
          />
        </section>

        <section className="space-y-6">
          <DashboardSectionHeader
            eyebrow="Application history"
            title="Review your current pipeline"
            description="A cleaner, more structured view of every role, company, status, and application date."
            className="sm:px-1"
            action={(
              <Link to="/jobseeker/search">
                <Button variant="outline">Browse more jobs</Button>
              </Link>
            )}
          />

          {loading ? (
            <div className="premium-panel flex min-h-[260px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent"></div>
            </div>
          ) : applications.length > 0 ? (
            <div className="grid gap-5">
              {applications.map((app) => {
                const config = statusConfig[app.status] || {
                  label: app.status,
                  tone: 'bg-slate-100 text-slate-700 border-slate-200',
                };

                return (
                  <div key={app.application_id} className="premium-panel p-6 sm:p-7" data-testid={`application-${app.application_id}`}>
                    <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${config.tone}`}>
                            {config.label}
                          </span>
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Application record
                          </span>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                            {app.job?.title || 'N/A'}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-accent" />
                              <span className="text-accent">{app.job?.company_name || 'N/A'}</span>
                            </div>
                            <div className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {app.job?.location || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[320px] xl:grid-cols-1">
                        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Applied on</div>
                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Last updated</div>
                          <div className="mt-2 text-sm font-semibold text-slate-900">
                            {new Date(app.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <CalendarClock className="h-4 w-4" />
                          Status note
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {app.status === 'shortlisted'
                            ? 'This role has moved forward. Stay ready for recruiter communication or next steps.'
                            : app.status === 'pending'
                            ? 'The application is currently under review. Keep your profile and inbox active.'
                            : app.status === 'accepted'
                            ? 'Congratulations. This role has reached a successful outcome.'
                            : 'This application is closed. Use it as signal for stronger future targeting.'}
                        </p>
                      </div>

                      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Role signal</div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          Review similar roles and improve your profile details to strengthen future conversion.
                        </p>
                      </div>

                      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <Sparkles className="h-4 w-4" />
                          Next move
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {app.status === 'shortlisted'
                            ? 'Check your messages and prepare any supporting material.'
                            : app.status === 'pending'
                            ? 'Keep applying to high-fit roles while waiting for recruiter review.'
                            : app.status === 'accepted'
                            ? 'Coordinate final communication and keep your application history documented.'
                            : 'Refine search criteria and focus on stronger role matches.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="premium-panel p-10 text-center sm:p-12">
              <div className="mx-auto max-w-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No applications yet</div>
                <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                  Your application pipeline is still empty.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Start applying to roles from the search workspace and this page will become your central command center for progress and outcomes.
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
