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

export default function MyJobs() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/recruiter/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="my-jobs">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A]">My Job Postings</h1>
          <Link to="/recruiter/post-job">
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
              Post New Job
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
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
                    <p className="text-slate-600">{job.location} • {job.job_type.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.required_skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <p className="text-sm text-slate-600">
                    Posted: {new Date(job.posted_at).toLocaleDateString()}
                  </p>
                  {job.status === 'approved' && (
                    <Link to={`/recruiter/applicants/${job.job_id}`}>
                      <Button variant="outline" className="rounded-full">
                        View Applicants
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600 text-lg mb-4">You haven't posted any jobs yet</p>
            <Link to="/recruiter/post-job">
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">
                Post Your First Job
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
