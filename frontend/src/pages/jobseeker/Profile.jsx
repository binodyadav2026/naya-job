import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
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
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function JobSeekerProfile() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState({
    user_id: user.user_id,
    skills: [],
    experience_years: 0,
    location: '',
    bio: '',
    preferred_job_types: [],
    preferred_salary_min: '',
    preferred_salary_max: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/job-seeker/${user.user_id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAddSkill = () => {
    const normalizedSkill = skillInput.trim();
    if (normalizedSkill && !profile.skills.includes(normalizedSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, normalizedSkill] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/profile/job-seeker', profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user} navigation={navigation}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="jobseeker-profile">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Candidate profile builder
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Build a profile that makes recruiter decisions easier.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                The stronger your profile, the better your role fit, AI recommendations, and recruiter confidence across the platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Skills added</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{profile.skills?.length || 0}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Experience</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{profile.experience_years || 0}y</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Profile signal</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">
                  {profile.bio?.trim() && profile.skills?.length > 2 ? 'Strong' : 'Needs refinement'}
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Clear role preferences, strong skills, and a concise summary help recruiters trust the profile faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Core profile"
              title="Your professional identity"
              description="Capture the profile essentials recruiters look at first."
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="location"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <div className="relative mt-2">
                  <BriefcaseBusiness className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    value={profile.experience_years || 0}
                    onChange={handleChange}
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="bio">Professional Summary</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio || ''}
                onChange={handleChange}
                rows={6}
                className="mt-2 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Summarize your strengths, experience, and the kind of work you want to be known for..."
              />
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Skills"
              title="Highlight the capabilities recruiters should notice"
              description="Keep this focused and high-signal so role matching becomes stronger."
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
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
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill) => (
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
                  Add your strongest skills so recruiters and AI recommendations can match you better.
                </div>
              )}
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Compensation preferences"
              title="Set a cleaner salary range"
              description="Use a clear range to guide opportunity fit and recruiter expectations."
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="preferred_salary_min">Minimum Salary (Annual)</Label>
                <div className="relative mt-2">
                  <BadgeIndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="preferred_salary_min"
                    name="preferred_salary_min"
                    type="number"
                    value={profile.preferred_salary_min || ''}
                    onChange={handleChange}
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferred_salary_max">Maximum Salary (Annual)</Label>
                <div className="relative mt-2">
                  <BadgeIndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="preferred_salary_max"
                    name="preferred_salary_max"
                    type="number"
                    value={profile.preferred_salary_max || ''}
                    onChange={handleChange}
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., 80000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
              A realistic salary preference helps surface better-fit roles and gives recruiters faster context.
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="accent"
              size="xl"
              className="min-w-[220px]"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
