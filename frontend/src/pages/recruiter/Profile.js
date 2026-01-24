import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Buy Credits', path: '/recruiter/credits', icon: CreditCard },
];

export default function RecruiterProfile() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState({
    user_id: user.user_id,
    company_name: '',
    company_website: '',
    company_description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/recruiter/${user.user_id}`);
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="recruiter-profile">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Company Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-slate-200 space-y-6">
          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={profile.company_name || ''}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company_website">Company Website</Label>
            <Input
              id="company_website"
              name="company_website"
              type="url"
              value={profile.company_website || ''}
              onChange={handleChange}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company_description">Company Description</Label>
            <textarea
              id="company_description"
              name="company_description"
              value={profile.company_description || ''}
              onChange={handleChange}
              rows={6}
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Tell candidates about your company..."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full py-6 font-semibold"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
