import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Globe,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';
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

export default function RecruiterProfile() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState({
    user_id: user.user_id,
    company_name: '',
    company_website: '',
    company_description: '',
    subscription_plan: 'free',
    subscription_status: 'inactive',
    jobs_posted_this_month: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/recruiter/${user.user_id}`);
      setProfile((current) => ({
        ...current,
        ...response.data,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/profile/recruiter', profile);
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

  const profileSignal =
    profile.company_name?.trim() &&
    profile.company_website?.trim() &&
    profile.company_description?.trim()
      ? 'Strong'
      : 'Needs refinement';

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div className="space-y-8" data-testid="recruiter-profile">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Company identity workspace
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Build a company profile that earns recruiter trust instantly.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                A stronger company profile gives candidates more confidence, improves role credibility, and makes your recruiter presence feel more established across the platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Current plan</div>
                <div className="mt-3 text-3xl font-heading font-extrabold capitalize text-white">
                  {profile.subscription_plan || 'free'}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Posting status</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">
                  {profile.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-md sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Profile signal</div>
                <div className="mt-3 text-3xl font-heading font-extrabold text-white">{profileSignal}</div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Clear company details and a strong description help candidates trust your brand and roles faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <StatPanel
            icon={Building2}
            label="Company status"
            value={profile.company_name?.trim() ? 'Named' : 'Pending'}
            detail="A recognizable company identity improves role quality and candidate trust."
            valueClassName={profile.company_name?.trim() ? 'text-emerald-500' : 'text-amber-500'}
          />
          <StatPanel
            icon={Globe}
            label="Website"
            value={profile.company_website?.trim() ? 'Linked' : 'Missing'}
            detail="Candidates often validate recruiter legitimacy through a live company website."
            valueClassName={profile.company_website?.trim() ? 'text-emerald-500' : 'text-amber-500'}
          />
          <StatPanel
            icon={ShieldCheck}
            label="Profile signal"
            value={profileSignal}
            detail="This reflects the strength of the company profile details currently filled in."
            valueClassName={profileSignal === 'Strong' ? 'text-violet-600' : 'text-amber-500'}
          />
          <StatPanel
            icon={Sparkles}
            label="Jobs this month"
            value={profile.jobs_posted_this_month || 0}
            detail="Your recruiter activity and company presence should feel consistent across the platform."
          />
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Company basics"
              title="Define the identity candidates should recognize"
              description="Start with the essential company details recruiters and candidates both expect to see."
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <div className="relative mt-2">
                  <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="company_name"
                    name="company_name"
                    value={profile.company_name || ''}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                    placeholder="e.g., Naya Labs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_website">Company Website</Label>
                <div className="relative mt-2">
                  <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="company_website"
                    name="company_website"
                    type="url"
                    value={profile.company_website || ''}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="h-12 rounded-[1.25rem] border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Brand story"
              title="Explain why candidates should trust your company"
              description="A short, credible company summary helps roles feel more legitimate and improves candidate confidence."
            />

            <div className="mt-6">
              <Label htmlFor="company_description">Company Description</Label>
              <Textarea
                id="company_description"
                name="company_description"
                value={profile.company_description || ''}
                onChange={handleChange}
                rows={8}
                className="mt-2 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Describe what your company does, who you serve, and what makes the team worth joining..."
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
              Keep this clear and professional. Candidates should quickly understand your company, the kind of work you do, and why joining the team is meaningful.
            </div>
          </section>

          <section className="premium-panel p-6 sm:p-8">
            <DashboardSectionHeader
              eyebrow="Recruiter note"
              title="What this profile should achieve"
              description="This page should make your company feel trustworthy, established, and ready to hire at scale."
            />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Trust</div>
                <div className="mt-2 text-lg font-heading font-bold text-slate-950">Credible company presence</div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Signal</div>
                <div className="mt-2 text-lg font-heading font-bold text-slate-950">Stronger candidate confidence</div>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Outcome</div>
                <div className="mt-2 text-lg font-heading font-bold text-slate-950">Better response quality</div>
              </div>
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
              {saving ? 'Saving...' : 'Save company profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
