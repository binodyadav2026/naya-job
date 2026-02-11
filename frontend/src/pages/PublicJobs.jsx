import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';

export default function PublicJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    job_type: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs', {
        params: { status: 'approved', ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-[#4F46E5]" />
              <span className="text-2xl font-bold text-[#0F172A]">JobConnect</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full px-6 font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-[#0F172A] text-white py-16" data-testid="search-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Find Your Dream Job</h1>
          <div className="bg-white rounded-lg p-4 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Button
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 rounded-full font-semibold"
              onClick={handleSearch}
              data-testid="search-btn"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {filteredJobs.length} Jobs Available
          </h2>
        </div>

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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">{job.title}</h3>
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

                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Link to="/register">
                    <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full font-semibold">
                      Apply Now
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
      </div>
    </div>
  );
}
