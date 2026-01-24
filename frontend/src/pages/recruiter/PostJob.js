import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
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

export default function PostJob() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    subscription_plan: 'free',
    subscription_status: 'inactive',
    jobs_posted_this_month: 0
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
        company_name: response.data.company_name || ''
      });
      setJobData({ ...jobData, company_name: response.data.company_name || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !jobData.required_skills.includes(skillInput.trim())) {
      setJobData({ ...jobData, required_skills: [...jobData.required_skills, skillInput.trim()] });
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
      
      // If it's a subscription issue, redirect to subscription page
      if (error.response?.status === 402) {
        setTimeout(() => {
          navigate('/recruiter/subscription');
        }, 2000);
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="post-job">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A]">Post a New Job</h1>
          <div className="text-right">
            <p className="text-sm text-slate-600">Available Credits</p>
            <p className="text-2xl font-bold text-[#4F46E5]">{credits}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-slate-200 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={jobData.company_name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows={6}
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="e.g., New York, NY or Remote"
              />
            </div>

            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <select
                id="job_type"
                name="job_type"
                value={jobData.job_type}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="salary_min">Minimum Salary (Annual)</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                value={jobData.salary_min}
                onChange={handleChange}
                className="mt-1"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <Label htmlFor="salary_max">Maximum Salary (Annual)</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                value={jobData.salary_max}
                onChange={handleChange}
                className="mt-1"
                placeholder="e.g., 80000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="experience_required">Years of Experience Required</Label>
            <Input
              id="experience_required"
              name="experience_required"
              type="number"
              value={jobData.experience_required}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Required Skills *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a required skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} className="bg-[#4F46E5] hover:bg-[#4338CA]">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {jobData.required_skills.map((skill) => (
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

          <div className="border-t pt-6">
            <p className="text-sm text-slate-600 mb-4">
              Posting this job will deduct 1 credit from your account. Your job will be reviewed by our admin team before going live.
            </p>
            <Button
              type="submit"
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full py-6 font-semibold"
              disabled={posting || credits < 1}
            >
              {posting ? 'Posting...' : credits < 1 ? 'Need Credits to Post' : 'Post Job (1 Credit)'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
