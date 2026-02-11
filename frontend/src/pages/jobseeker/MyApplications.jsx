import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Search, FileText, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/jobseeker', icon: Home },
  { name: 'Profile', path: '/jobseeker/profile', icon: User },
  { name: 'Search Jobs', path: '/jobseeker/search', icon: Search },
  { name: 'My Applications', path: '/jobseeker/applications', icon: FileText },
  { name: 'Messages', path: '/jobseeker/messages', icon: MessageSquare },
];

export default function MyApplications() {
  const { user } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="my-applications">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">My Applications</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {applications.map((app) => (
                    <tr key={app.application_id} data-testid={`application-${app.application_id}`}>
                      <td className="px-6 py-4 font-medium text-[#0F172A]">
                        {app.job?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {app.job?.company_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {app.job?.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(app.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600 text-lg mb-4">You haven't applied to any jobs yet</p>
            <a
              href="/jobseeker/search"
              className="inline-block bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-full font-semibold"
            >
              Browse Jobs
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
