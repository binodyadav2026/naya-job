import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Search, FileText, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function JobSeekerDashboard() {
  const { user } = useOutletContext();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, appsRes] = await Promise.all([
        api.get('/ai/job-recommendations'),
        api.get('/applications/my-applications'),
      ]);
      setRecommendations(recsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="jobseeker-dashboard">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Welcome back, {user.name}!</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-[#0F172A]">{applications.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-[#F59E0B]">
              {applications.filter((a) => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Shortlisted</p>
            <p className="text-3xl font-bold text-[#10B981]">
              {applications.filter((a) => a.status === 'shortlisted').length}
            </p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">AI-Powered Recommendations</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid gap-4">
              {recommendations.map((job) => (
                <div
                  key={job.job_id}
                  className="bg-white p-6 rounded-lg border border-slate-200 card-hover"
                >
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{job.title}</h3>
                  <p className="text-[#4F46E5] font-semibold mb-2">{job.company_name}</p>
                  <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>
                  <Link to="/jobseeker/search">
                    <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-600">Complete your profile to get personalized recommendations</p>
              <Link to="/jobseeker/profile">
                <Button className="mt-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                  Complete Profile
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Recent Applications</h2>
          {applications.length > 0 ? (
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Applied</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.application_id}>
                        <td className="px-6 py-4 font-medium text-[#0F172A]">{app.job?.title}</td>
                        <td className="px-6 py-4 text-slate-600">{app.job?.company_name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              app.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : app.status === 'shortlisted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-slate-600">You haven't applied to any jobs yet</p>
              <Link to="/jobseeker/search">
                <Button className="mt-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
