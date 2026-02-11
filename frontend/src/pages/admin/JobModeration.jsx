import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, Users, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
];

export default function JobModeration() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/jobs', {
        params: filter !== 'all' ? { status: filter } : {},
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await api.put(`/admin/jobs/${jobId}/approve`);
      toast.success('Job approved successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to approve job');
    }
  };

  const handleReject = async (jobId) => {
    if (!window.confirm('Are you sure you want to reject this job?')) return;

    try {
      await api.put(`/admin/jobs/${jobId}/reject`);
      toast.success('Job rejected');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to reject job');
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="job-moderation">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Job Moderation</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              className={`rounded-full capitalize ${
                filter === status ? 'bg-[#4F46E5] text-white' : ''
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white p-6 rounded-lg border border-slate-200"
                data-testid={`job-${job.job_id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">{job.title}</h3>
                    <p className="text-[#4F46E5] font-semibold">{job.company_name}</p>
                  </div>
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
                </div>

                <p className="text-slate-600 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.required_skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <p className="text-sm text-slate-600">
                    Posted: {new Date(job.posted_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600">
                    Location: {job.location}
                  </p>
                  {job.status === 'pending' && (
                    <div className="ml-auto flex gap-2">
                      <Button
                        onClick={() => handleApprove(job.job_id)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(job.job_id)}
                        variant="outline"
                        className="rounded-full"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600">No jobs found with status: {filter}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
