import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import {
  BadgeIndianRupee,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Subscription', path: '/recruiter/subscription', icon: CreditCard },
];

export default function PostJob() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    subscription_plan: 'free',
    subscription_status: 'inactive',
    jobs_posted_this_month: 0,
    company_name: '',
  });
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company_name: '',
    location: '',
    salary_min: '',
    salary_max: '',
    job_type: 'full_time',
    required_skills: [],
    experience_required: 0,
  });
  const [skillInput, setSkillInput] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/recruiter/${user.user_id}`);
      setProfile({
        subscription_plan: response.data.subscription_plan || 'free',
        subscription_status: response.data.subscription_status || 'inactive',
        jobs_posted_this_month: response.data.jobs_posted_this_month || 0,
        company_name: response.data.company_name || '',
      });
      setJobData((current) => ({ ...current, company_name: response.data.company_name || '' }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleAddSkill = () => {
    const normalizedSkill = skillInput.trim();
    if (normalizedSkill && !jobData.required_skills.includes(normalizedSkill)) {
      setJobData({ ...jobData, required_skills: [...jobData.required_skills, normalizedSkill] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setJobData({ ...jobData, required_skills: jobData.required_skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPosting(true);
    try {
      await api.post('/jobs', jobData);
      toast.success('Job posted successfully! Awaiting admin approval.');
      navigate('/recruiter/my-jobs');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to post job';
      toast.error(errorMessage);

      if (error.response?.status === 402) {
        setTimeout(() => {
          navigate('/recruiter/subscription');
        }, 2000);
      }
    } finally {
      setPosting(false);
    }
  };

  const canPost = profile.subscription_status === 'active';

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="post-job">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Job publishing workflow
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Create a role with the clarity a premium hiring team expects.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Structure the role properly once, then move it through approval and into the live recruiting pipeline with more confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Current plan</div>
                <div className="mt-3 text-3xl font-heading font-extrabold capitalize text-white">{profile.subscription_plan}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Status</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">
                  {canPost ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Posting volume</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">
                  {profile.jobs_posted_this_month} jobs this month
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Your role will be reviewed by admin before going live on the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Role basics"
              title="Define the job clearly"
              description="Start with the essentials recruiters and candidates both need to understand quickly."
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <div className="relative mt-2">
                  <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="title"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <div className="relative mt-2">
                  <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="company_name"
                    name="company_name"
                    value={jobData.company_name}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                rows={8}
                className="mt-2 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Describe the role, responsibilities, key expectations, and what a strong candidate looks like..."
              />
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Role setup"
              title="Set location, type, and salary range"
              description="Give candidates and the platform enough structure to qualify fit quickly."
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="location"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="job_type">Job Type</Label>
                <select
                  id="job_type"
                  name="job_type"
                  value={jobData.job_type}
                  onChange={handleChange}
                  className="mt-2 h-12 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="salary_min">Minimum Salary (Annual)</Label>
                <div className="relative mt-2">
                  <BadgeIndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    value={jobData.salary_min}
                    onChange={handleChange}
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salary_max">Maximum Salary (Annual)</Label>
                <div className="relative mt-2">
                  <BadgeIndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    value={jobData.salary_max}
                    onChange={handleChange}
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., 80000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-md">
              <Label htmlFor="experience_required">Experience Required</Label>
              <Input
                id="experience_required"
                name="experience_required"
                type="number"
                value={jobData.experience_required}
                onChange={handleChange}
                className="mt-2 h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4"
              />
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Required skills"
              title="Define what a qualified candidate should bring"
              description="Keep this focused and high-signal so the right candidates understand the role immediately."
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a required skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4"
              />
              <Button type="button" variant="accent" onClick={handleAddSkill} className="sm:min-w-[140px]">
                <Plus className="h-4 w-4" />
                Add skill
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {jobData.required_skills.length > 0 ? (
                jobData.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/70 text-accent transition-colors hover:bg-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Add the key skills needed for this role to improve applicant quality and clarity.
                </div>
              )}
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Publishing rules"
              title="Before you publish"
              description="Keep the role structured and aligned with your active recruiter plan."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Plan</div>
                <div className="mt-2 text-lg font-heading font-bold capitalize text-slate-950">{profile.subscription_plan}</div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Posting status</div>
                <div className="mt-2 text-lg font-heading font-bold text-slate-950">
                  {canPost ? 'Eligible to post' : 'Upgrade required'}
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">This month</div>
                <div className="mt-2 text-lg font-heading font-bold text-slate-950">{profile.jobs_posted_this_month} posted</div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
              Your job will be reviewed by the admin team before it goes live. Keep the role description clear, the skills focused, and the compensation range realistic for better applicant quality.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {!canPost ? (
                <Link to="/recruiter/subscription">
                  <Button variant="outline" size="xl">
                    Upgrade plan
                  </Button>
                </Link>
              ) : null}
              <Button
                type="submit"
                variant="accent"
                size="xl"
                disabled={posting || !canPost}
              >
                {posting ? 'Posting...' : canPost ? 'Post job' : 'Upgrade required to post'}
              </Button>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  );
}
