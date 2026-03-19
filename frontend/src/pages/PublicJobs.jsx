import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';
import BrandLogo from '../components/BrandLogo';

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
    <div className="min-h-screen bg-surface-subtle">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-xl">
        <div className="section-container">
          <div className="flex h-20 items-center justify-between">
            <BrandLogo linked showWordmark />
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" className="font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="hero-mesh py-16 text-white" data-testid="search-section">
        <div className="section-container">
          <h1 className="mb-8 text-center text-4xl font-heading font-extrabold tracking-[-0.04em]">Find your next role with confidence</h1>
          <div className="premium-panel flex flex-col gap-4 rounded-[1.75rem] p-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-10"
                  data-testid="search-input"
                />
              </div>
            </div>
            <Button
              variant="accent"
              size="xl"
              onClick={handleSearch}
              data-testid="search-btn"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="section-container py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-slate-950">
            {filteredJobs.length} Jobs Available
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid gap-6" data-testid="jobs-list">
            {filteredJobs.map((job) => (
              <div
                key={job.job_id}
                className="premium-panel p-6"
                data-testid={`job-card-${job.job_id}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link to={`/jobs/${job.job_id}`} className="block group">
                      <h3 className="mb-2 text-xl font-heading font-bold text-slate-950 transition-colors group-hover:text-accent">{job.title}</h3>
                    </Link>
                    <p className="mb-3 font-semibold text-accent">{job.company_name}</p>

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
                          className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Link to={`/jobs/${job.job_id}`}>
                    <Button variant="accent" className="font-semibold">
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
      </div>
    </div>
  );
}
