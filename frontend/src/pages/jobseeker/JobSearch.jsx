import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Home, User, Search, FileText, MessageSquare, MapPin, DollarSign, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
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

export default function JobSearch() {
  const { user } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs', { params: { status: 'approved' } });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await api.post('/applications', {
        job_id: selectedJob.job_id,
        cover_letter: coverLetter,
      });
      toast.success('Application submitted successfully!');
      setShowApplyDialog(false);
      setCoverLetter('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="job-search">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Search Jobs</h1>

        {/* Search */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-2xl"
            data-testid="job-search-input"
          />
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : (
          <div className="grid gap-6" data-testid="jobs-list">
            {filteredJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white p-6 rounded-lg border border-slate-200 card-hover"
                data-testid={`job-card-${job.job_id}`}
              >
                <div className="flex-1">
                  <Link to={`/jobseeker/jobs/${job.job_id}`} className="block group">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#4F46E5] transition-colors">{job.title}</h3>
                  </Link>
                  <p className="text-[#4F46E5] font-semibold mb-3">{job.company_name}</p>

                  <div className="flex flex-wrap gap-4 text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary_min && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          ${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="capitalize">{job.job_type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.required_skills.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link to={`/jobseeker/jobs/${job.job_id}`}>
                    <Button
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full font-semibold"
                      data-testid={`view-btn-${job.job_id}`}
                    >
                      View Details & Apply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-600 text-lg">No jobs found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Apply Dialog */}
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent data-testid="apply-dialog">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  placeholder="Tell the employer why you're a great fit for this role..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApplyDialog(false)}
                disabled={applying}
              >
                Cancel
              </Button>
              <Button
                onClick={submitApplication}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                disabled={applying}
                data-testid="submit-application-btn"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
