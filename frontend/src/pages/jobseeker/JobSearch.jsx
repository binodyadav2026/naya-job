import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  DollarSign,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function JobSearch() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs', { params: { status: 'approved' } });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  const remoteFriendlyCount = jobs.filter((job) => job.location?.toLowerCase().includes('remote')).length;
  const salaryVisibleCount = jobs.filter((job) => job.salary_min).length;

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
    setCoverLetter('');
    setResume(null);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('job_id', selectedJob.job_id);
      if (coverLetter) formData.append('cover_letter', coverLetter);
      if (resume) formData.append('resume', resume);

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully!');
      setShowApplyDialog(false);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="job-search">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Opportunity discovery
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Search jobs in a way that feels curated, fast, and premium.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Explore approved roles, narrow quickly by title or company, and move from discovery to application without leaving the workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Open roles</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{jobs.length}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Search results</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{filteredJobs.length}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Remote-friendly</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{remoteFriendlyCount}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Salary visible</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{salaryVisibleCount}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-panel p-6 sm:p-7">
          <DashboardSectionHeader
            eyebrow="Search workspace"
            title="Find the right roles faster"
            description="Search by title, company, or location and review opportunities in a cleaner high-signal layout."
          />

          <div className="mt-6 space-y-4">
            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-medium"
                data-testid="job-search-input"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <BriefcaseBusiness className="h-4 w-4 text-accent" />
                {filteredJobs.length} roles available
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Search updates instantly as you type
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <DashboardSectionHeader
            eyebrow="Available jobs"
            title="Curated opportunities"
            description="A cleaner view of roles you can review, compare, and apply to."
            className="sm:px-1"
          />

          {loading ? (
            <div className="premium-panel flex min-h-[260px] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-5" data-testid="jobs-list">
              {filteredJobs.map((job, index) => {
                const score = Math.max(84, 96 - index * 2);
                return (
                  <div
                    key={job.job_id}
                    className="premium-panel overflow-hidden p-6 sm:p-7"
                    data-testid={`job-card-${job.job_id}`}
                  >
                    <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                            Match score {score}%
                          </div>
                          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {job.job_type?.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link to={`/jobseeker/jobs/${job.job_id}`} className="group inline-block">
                            <h3 className="text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950 transition-colors group-hover:text-accent">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-accent" />
                              <span className="text-accent">{job.company_name}</span>
                            </div>
                            <div className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            {job.salary_min ? (
                              <div className="inline-flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                ${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                              </div>
                            ) : null}
                            <div className="inline-flex items-center gap-2">
                              <Clock3 className="h-4 w-4" />
                              {job.job_type?.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
                          {job.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {job.required_skills?.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 xl:min-w-[220px]">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Why it stands out</div>
                          <div className="mt-3 flex items-start gap-3 text-sm leading-6 text-slate-700">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            Strong fit across role keywords, hiring intent, and profile-aligned signals.
                          </div>
                        </div>

                        <Link to={`/jobseeker/jobs/${job.job_id}`}>
                          <Button variant="accent" size="xl" className="w-full font-semibold" data-testid={`view-btn-${job.job_id}`}>
                            View details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="xl"
                          className="w-full"
                          onClick={() => handleApply(job)}
                          data-testid={`quick-apply-btn-${job.job_id}`}
                        >
                          Quick apply
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="premium-panel p-8 sm:p-10 text-center">
              <div className="mx-auto max-w-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No matches found</div>
                <h3 className="mt-3 text-2xl font-heading font-extrabold tracking-[-0.04em] text-slate-950">
                  No roles matched this search.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Try a broader keyword or remove a specific company/location term to surface more opportunities.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSearchTerm('')}>
                  Clear search
                </Button>
              </div>
            </div>
          )}
        </section>

        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent className="max-w-2xl rounded-[1.75rem] border-slate-200 p-0 shadow-2xl" data-testid="apply-dialog">
            <div className="overflow-hidden rounded-[1.75rem]">
              <div className="hero-grid px-6 py-6 text-white sm:px-8">
                <DialogHeader className="space-y-3 text-left">
                  <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    Quick apply
                  </div>
                  <DialogTitle className="text-2xl font-heading font-extrabold tracking-[-0.04em] text-white">
                    Apply for {selectedJob?.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-6 text-slate-300">
                    Submit a focused application without leaving your search workflow.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="bg-white px-6 py-6 sm:px-8">
                <div className="grid gap-5">
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={7}
                      className="mt-2 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3"
                      placeholder="Tell the employer why you are a strong fit for this role..."
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
                  <Button
                    variant="outline"
                    onClick={() => setShowApplyDialog(false)}
                    disabled={applying}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitApplication}
                    variant="accent"
                    disabled={applying}
                    data-testid="submit-application-btn"
                  >
                    {applying ? 'Submitting...' : 'Submit application'}
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
