import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
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

export default function Applicants() {
  const { jobId } = useParams();
  const { user } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status?status=${status}`);
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="applicants-page">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Job Applicants</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.application_id} className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{app.job_seeker?.name}</h3>
                    <p className="text-slate-600">{app.job_seeker?.email}</p>
                  </div>
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
                </div>

                {app.profile && (
                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Experience:</span> {app.profile.experience_years} years
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Location:</span> {app.profile.location || 'Not specified'}
                    </p>
                    {app.profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {app.profile.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {app.cover_letter && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Cover Letter:</p>
                    <p className="text-sm text-slate-600">{app.cover_letter}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {app.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => updateStatus(app.application_id, 'shortlisted')}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                      >
                        Shortlist
                      </Button>
                      <Button
                        onClick={() => updateStatus(app.application_id, 'rejected')}
                        variant="outline"
                        className="rounded-full"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {app.status === 'shortlisted' && (
                    <Button
                      onClick={() => updateStatus(app.application_id, 'accepted')}
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full"
                    >
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600">No applications yet for this job</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
