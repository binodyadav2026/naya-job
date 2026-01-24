import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Search, FileText, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="jobseeker-profile">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">My Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-slate-200 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={profile.location || ''}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                name="experience_years"
                type="number"
                value={profile.experience_years || 0}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <Label>Skills</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} className="bg-[#4F46E5] hover:bg-[#4338CA]">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="preferred_salary_min">Minimum Salary (Annual)</Label>
              <Input
                id="preferred_salary_min"
                name="preferred_salary_min"
                type="number"
                value={profile.preferred_salary_min}
                onChange={handleChange}
                className="mt-1"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <Label htmlFor="preferred_salary_max">Maximum Salary (Annual)</Label>
              <Input
                id="preferred_salary_max"
                name="preferred_salary_max"
                type="number"
                value={profile.preferred_salary_max}
                onChange={handleChange}
                className="mt-1"
                placeholder="e.g., 80000"
              />
            </div>
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
