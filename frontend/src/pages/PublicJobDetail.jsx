import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Clock3,
  DollarSign,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Search,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';
import DashboardSectionHeader from '../components/dashboard/DashboardSectionHeader';
import api from '../utils/api';
import { toast } from 'sonner';
import BrandLogo from '../components/BrandLogo';

const jobSeekerNavigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function PublicJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.allSettled([
          api.get(`/jobs/${jobId}`),
          api.get('/auth/me'),
        ]);

        if (jobRes.status === 'fulfilled') {
          setJob(jobRes.value.data);
        } else {
          toast.error('Job not found');
        }

        if (userRes.status === 'fulfilled') {
          setUser(userRes.value.data);
          if (userRes.value.data.role === 'job_seeker' && jobRes.status === 'fulfilled') {
            checkApplicationStatus(jobId);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const checkApplicationStatus = async (id) => {
    try {
      const res = await api.get('/applications/my-applications');
      const applied = res.data.some((app) => app.job_id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('job_id', job.job_id);
      if (coverLetter) formData.append('cover_letter', coverLetter);
      if (resume) formData.append('resume', resume);

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setOpenApplyDialog(false);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="mb-4 text-2xl font-heading font-bold text-slate-800">Job Not Found</h2>
        <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
      </div>
    );
  }

  const backPath = user?.role === 'job_seeker'
    ? '/jobseeker/search'
    : user?.role === 'recruiter'
    ? '/recruiter'
    : user?.role === 'admin'
    ? '/admin'
    : '/jobs';

  const quickFacts = [
    {
      label: 'Location',
      value: job.location,
      icon: MapPin,
    },
    {
      label: 'Salary',
      value: job.salary_min
        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
        : 'Not disclosed',
      icon: DollarSign,
    },
    {
      label: 'Job Type',
      value: job.job_type?.replace('_', ' '),
      icon: Clock3,
    },
  ];

  const applicationDialog = (
    <Dialog open={openApplyDialog} onOpenChange={setOpenApplyDialog}>
      <DialogTrigger asChild>
        <Button variant="accent" size="xl" className="w-full sm:w-auto">
          Apply now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[1.75rem] border-slate-200 p-0 shadow-2xl">
        <div className="overflow-hidden rounded-[1.75rem]">
          <div className="hero-grid px-6 py-6 text-white sm:px-8">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Job application
              </div>
              <DialogTitle className="text-2xl font-heading font-extrabold tracking-[-0.04em] text-white">
                Apply for {job.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-300">
                Submit a focused application without leaving your workflow.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="bg-white px-6 py-6 sm:px-8">
            <div className="grid gap-5">
              <div>
                <Label htmlFor="cover-letter">Cover Letter</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Introduce yourself and explain why you're a strong fit..."
                  rows={8}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="mt-2 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>
              <div>
                <Label htmlFor="resume">Resume / CV</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="mt-2 h-12 cursor-pointer rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 file:mr-4 file:rounded-full file:border-0 file:bg-violet-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-violet-700"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 border-t border-slate-200 pt-5">
              <Button variant="outline" onClick={() => setOpenApplyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply} disabled={applying} variant="accent">
                {applying ? 'Submitting...' : 'Submit application'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const detailContent = (
    <div className="space-y-8">
      <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="ambient-orb left-[-3rem] top-10 h-40 w-40 bg-fuchsia-500/35" />
        <div className="ambient-orb bottom-0 right-10 h-44 w-44 bg-cyan-400/18" />

        <div className="relative">
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center text-sm font-medium text-white/72 transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <div className="mt-6 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Job detail workspace
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300">
                <div className="inline-flex items-center gap-2 text-violet-200">
                  <Building2 className="h-4 w-4" />
                  {job.company_name}
                </div>
                <div className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {job.job_type?.replace('_', ' ')}
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Review the role with full context, understand why it matters, and move straight into application if it fits your next step.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Application status</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">
                  {hasApplied ? 'Already applied' : 'Open for application'}
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {hasApplied
                    ? 'You have already submitted an application for this role.'
                    : 'Review the details and apply directly from this page when you are ready.'}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Role quality</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">High</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Workflow</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">Premium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Role overview"
              title="Everything you need to evaluate this opportunity"
              description="A cleaner, more structured reading experience for high-signal job review."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{fact.label}</div>
                    <div className="mt-2 text-sm font-semibold capitalize text-slate-900">{fact.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Job description"
              title="Role details"
              description="A more readable view of the opportunity, responsibilities, and expected fit."
            />
            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">
              {job.description}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="premium-panel p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Action panel</div>
            <h2 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
              Move this role forward
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Decide quickly, keep your search moving, and use the dedicated applications area for full tracking later.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {!user ? (
                <Link to={`/login?redirect=/jobs/${jobId}`}>
                  <Button variant="accent" size="xl" className="w-full">
                    Login to apply
                  </Button>
                </Link>
              ) : user.role === 'job_seeker' ? (
                hasApplied ? (
                  <Button disabled className="w-full bg-green-600 text-white text-base font-semibold opacity-100">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Application submitted
                  </Button>
                ) : (
                  applicationDialog
                )
              ) : user.role === 'recruiter' && job.recruiter_id === user.user_id ? (
                <Link to={`/recruiter/applicants/${job.job_id}`}>
                  <Button variant="outline" size="xl" className="w-full">
                    View applicants
                  </Button>
                </Link>
              ) : null}

              <Link to={user?.role === 'job_seeker' ? '/jobseeker/search' : '/jobs'}>
                <Button variant="outline" size="xl" className="w-full">
                  Back to listings
                </Button>
              </Link>
            </div>
          </div>

          <div className="premium-panel p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Required skills</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {job.required_skills?.map((skill, idx) => (
                <span
                  key={`${skill}-${idx}`}
                  className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  if (user?.role === 'job_seeker') {
    return (
      <DashboardLayout user={user} navigation={jobSeekerNavigation}>
        {detailContent}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-xl">
        <div className="section-container">
          <div className="flex h-20 items-center justify-between">
            <BrandLogo
              linked
              showWordmark
              to={user ? (user.role === 'recruiter' ? '/recruiter' : '/jobseeker') : '/'}
            />
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden font-medium text-slate-600 sm:block">Hi, {user.name}</span>
                  {user.role === 'recruiter' ? (
                    <Link to="/recruiter">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/admin">
                      <Button variant="outline">Admin</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="accent">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-8">
        {detailContent}
      </main>
    </div>
  );
}
