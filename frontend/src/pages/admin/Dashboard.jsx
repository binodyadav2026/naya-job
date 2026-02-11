import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, Users, Briefcase, BarChart } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
];

export default function AdminDashboard() {
  const { user } = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="admin-dashboard">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : analytics ? (
          <>
            {/* User Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4">User Statistics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-[#0F172A]">{analytics.users.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Job Seekers</p>
                  <p className="text-3xl font-bold text-[#10B981]">{analytics.users.job_seekers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Recruiters</p>
                  <p className="text-3xl font-bold text-[#4F46E5]">{analytics.users.recruiters}</p>
                </div>
              </div>
            </div>

            {/* Job Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4">Job Statistics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Total Jobs</p>
                  <p className="text-3xl font-bold text-[#0F172A]">{analytics.jobs.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Approved Jobs</p>
                  <p className="text-3xl font-bold text-[#10B981]">{analytics.jobs.approved}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Pending Approval</p>
                  <p className="text-3xl font-bold text-[#F59E0B]">{analytics.jobs.pending}</p>
                </div>
              </div>
            </div>

            {/* Application Stats */}
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-4">Application Statistics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Total Applications</p>
                  <p className="text-3xl font-bold text-[#0F172A]">{analytics.applications.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600 mb-2">Pending Applications</p>
                  <p className="text-3xl font-bold text-[#F59E0B]">{analytics.applications.pending}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600">Unable to load analytics</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
