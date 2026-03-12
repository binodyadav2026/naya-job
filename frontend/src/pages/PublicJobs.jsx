import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../utils/api";

export default function PublicJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    job_type: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs", {
        params: { status: "approved", ...filters },
      });

      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900">
                NayaJob
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>

              <Link to="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* HERO SEARCH */}
{/* HERO */}
<section className="bg-gradient-to-br from-blue-50 to-white py-20 border-b">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

    {/* LEFT SIDE */}
    <div>

      <p className="text-sm font-semibold text-blue-600 mb-3">
        INDIA'S #1 JOB PLATFORM
      </p>

      <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
        Your job search <br /> ends here
      </h1>

      <p className="text-slate-600 text-lg mb-8">
        Discover 50 lakh+ career opportunities from top companies
      </p>

      {/* SEARCH BOX */}
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-3 flex flex-col md:flex-row gap-3">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Search jobs by skill"
            className="pl-10 border-0 focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Input
          placeholder="Your experience"
          className="border-0 focus-visible:ring-0"
        />

        <Input
          placeholder="Location"
          className="border-0 focus-visible:ring-0"
        />

        <Button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-8 rounded-lg"
        >
          Search Jobs
        </Button>

      </div>

      {/* TRUST COMPANIES */}
      <div className="mt-10">

        <p className="text-sm text-slate-500 mb-3">
          Trusted by top companies
        </p>

        <div className="flex gap-8 text-slate-400 font-semibold text-lg">

          <span>Uber</span>
          <span>Swiggy</span>
          <span>Zomato</span>
          <span>UrbanCo</span>

        </div>

      </div>

    </div>

    {/* RIGHT SIDE IMAGE */}
    <div className="hidden md:flex justify-center">

      <img
        src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
        className="rounded-1xl shadow-xl w-[420px]"
      />

    </div>

  </div>

</section>

      {/* JOBS */}
      <section className="max-w-6xl mx-auto px-6 py-14">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredJobs.length} Jobs Available
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">

            {filteredJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
              >

                <div className="flex justify-between">

                  <div className="flex-1">

                    <Link to={`/jobs/${job.job_id}`}>
                      <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-indigo-600 font-semibold mt-1">
                      {job.company_name}
                    </p>

                    <div className="flex flex-wrap gap-6 text-slate-600 mt-4 text-sm">

                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </div>

                      {job.salary_min && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          ${job.salary_min.toLocaleString()} - $
                          {job.salary_max?.toLocaleString()}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.job_type.replace("_", " ")}
                      </div>

                    </div>

                    <p className="text-slate-600 mt-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">

                      {job.required_skills?.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>

                  <div className="flex items-center">
                    <Link to={`/jobs/${job.job_id}`}>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full">
                        View Job
                      </Button>
                    </Link>
                  </div>

                </div>

              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-600 text-lg">
                  No jobs found. Try adjusting your search.
                </p>
              </div>
            )}

          </div>
        )}
      </section>

    </div>
  );
}