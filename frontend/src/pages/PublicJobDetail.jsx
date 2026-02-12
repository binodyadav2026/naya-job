import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, ArrowLeft, Building, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import api from '../utils/api';
import { toast } from 'sonner';

export default function PublicJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.allSettled([
          api.get(`/jobs/${jobId}`),
          api.get('/auth/me')
        ]);

        if (jobRes.status === 'fulfilled') {
          setJob(jobRes.value.data);
        } else {
          toast.error("Job not found");
        }

        if (userRes.status === 'fulfilled') {
          setUser(userRes.value.data);
          // Check if already applied (for job seekers)
          if (userRes.value.data.role === 'job_seeker' && jobRes.status === 'fulfilled') {
            checkApplicationStatus(jobId);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const checkApplicationStatus = async (id) => {
    try {
      const res = await api.get('/applications/my-applications');
      const applied = res.data.some(app => app.job_id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('job_id', job.job_id);
      if (coverLetter) formData.append('cover_letter', coverLetter);
      if (resume) formData.append('resume', resume);

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setOpenApplyDialog(false);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Job Not Found</h2>
        <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Conditional based on Auth */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={user ? (user.role === 'recruiter' ? '/recruiter' : '/jobseeker') : '/'} className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-[#4F46E5]" />
              <span className="text-2xl font-bold text-[#0F172A]">JobConnect</span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium hidden sm:block">Hi, {user.name}</span>
                  {user.role === 'job_seeker' ? (
                    <Link to="/jobseeker">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  ) : user.role === 'recruiter' ? (
                    <Link to="/recruiter">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/admin">
                      <Button variant="outline">Admin</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-slate-600 hover:text-[#4F46E5] mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{job.title}</h1>
              <div className="flex items-center text-[#4F46E5] font-semibold text-lg">
                <Building className="h-5 w-5 mr-2" />
                {job.company_name}
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              {!user ? (
                <Link to={`/login?redirect=/jobs/${jobId}`}>
                  <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                    Login to Apply
                  </Button>
                </Link>
              ) : user.role === 'job_seeker' ? (
                hasApplied ? (
                  <Button disabled className="bg-green-600 text-white px-8 py-6 text-lg rounded-full font-semibold opacity-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Applied
                  </Button>
                ) : (
                  <Dialog open={openApplyDialog} onOpenChange={setOpenApplyDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="cover-letter">Cover Letter</Label>
                          <Textarea
                            id="cover-letter"
                            placeholder="Introduce yourself and explain why you're a good fit..."
                            rows={8}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resume">Resume / CV</Label>
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResume(e.target.files[0])}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenApplyDialog(false)}>Cancel</Button>
                        <Button onClick={handleApply} disabled={applying} className="bg-[#4F46E5] text-white">
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )
              ) : user.role === 'recruiter' && job.recruiter_id === user.user_id ? (
                <div className="flex gap-3">
                  <Link to={`/recruiter/applicants/${job.job_id}`}>
                    <Button variant="outline" className="px-6 py-6 text-lg rounded-full border-2">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-slate-700">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <MapPin className="h-6 w-6 text-[#4F46E5]" />
              <div>
                <p className="text-sm text-slate-500 font-medium">Location</p>
                <p className="font-semibold">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-[#4F46E5]" />
              <div>
                <p className="text-sm text-slate-500 font-medium">Salary</p>
                <p className="font-semibold">
                  {job.salary_min ? `$${job.salary_min.toLocaleString()} - $${job.salary_max?.toLocaleString()}` : 'Not disclosed'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <Clock className="h-6 w-6 text-[#4F46E5]" />
              <div>
                <p className="text-sm text-slate-500 font-medium">Job Type</p>
                <p className="font-semibold capitalize">{job.job_type?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-slate-700 mb-10">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4 border-b pb-2">Job Description</h3>
            <div className="whitespace-pre-wrap leading-relaxed text-lg">{job.description}</div>
          </div>

          <div className="pt-6">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills?.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-[#EEF2FF] text-[#4F46E5] rounded-full font-medium border border-[#E0E7FF]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
