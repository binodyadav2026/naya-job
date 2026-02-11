import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Subscription', path: '/recruiter/subscription', icon: CreditCard },
];

export default function RecruiterDashboard() {
  const { user } = useOutletContext();
  const [stats, setStats] = useState({ 
    subscription_plan: 'free',
    subscription_status: 'inactive',
    subscription_end: null,
    jobs_posted_this_month: 0,
    jobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        api.get(`/profile/recruiter/${user.user_id}`),
        api.get('/jobs/recruiter/my-jobs'),
      ]);
      setStats({
        subscription_plan: profileRes.data.subscription_plan || 'free',
        subscription_status: profileRes.data.subscription_status || 'inactive',
        subscription_end: profileRes.data.subscription_end,
        jobs_posted_this_month: profileRes.data.jobs_posted_this_month || 0,
        jobs: jobsRes.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="recruiter-dashboard">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Recruiter Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Current Plan</p>
            <p className="text-3xl font-bold text-[#4F46E5] capitalize">{stats.subscription_plan}</p>
            <Link to="/recruiter/subscription">
              <Button className="mt-4 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                {stats.subscription_status === 'active' ? 'Manage' : 'Subscribe'}
              </Button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Subscription Status</p>
            <p className={`text-2xl font-bold ${stats.subscription_status === 'active' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
              {stats.subscription_status === 'active' ? 'Active' : 'Inactive'}
            </p>
            {stats.subscription_end && stats.subscription_status === 'active' && (
              <p className="text-xs text-slate-500 mt-2">
                Valid until: {new Date(stats.subscription_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Jobs Posted This Month</p>
            <p className="text-3xl font-bold text-[#0F172A]">{stats.jobs_posted_this_month}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Total Jobs</p>
            <p className="text-3xl font-bold text-[#0F172A]">{stats.jobs.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/recruiter/post-job">
              <div className="bg-white p-6 rounded-lg border border-slate-200 card-hover h-full">
                <Briefcase className="h-12 w-12 text-[#4F46E5] mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Post a New Job</h3>
                <p className="text-slate-600">Create and publish a new job listing</p>
              </div>
            </Link>
            <Link to="/recruiter/my-jobs">
              <div className="bg-white p-6 rounded-lg border border-slate-200 card-hover h-full">
                <FileText className="h-12 w-12 text-[#4F46E5] mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Manage Jobs</h3>
                <p className="text-slate-600">View and edit your job listings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Recent Job Postings</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
            </div>
          ) : stats.jobs.length > 0 ? (
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {stats.jobs.slice(0, 5).map((job) => (
                      <tr key={job.job_id}>
                        <td className="px-6 py-4 font-medium text-[#0F172A]">{job.title}</td>
                        <td className="px-6 py-4 text-slate-600">{job.location}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(job.posted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-600 mb-4">You haven't posted any jobs yet</p>
              <Link to="/recruiter/post-job">
                <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                  Post Your First Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
