import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, MessageSquare, Search, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-[#4F46E5]" />
              <span className="text-2xl font-bold tracking-tight text-[#0F172A]">JobConnect</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-[#4F46E5] transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-[#4F46E5] transition-colors font-medium">
                How It Works
              </a>
              <Link to="/jobs" className="text-slate-600 hover:text-[#4F46E5] transition-colors font-medium">
                Browse Jobs
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium" data-testid="header-login-btn">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full px-6 font-semibold" data-testid="header-register-btn">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-gradient text-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Find Your Dream Job With AI-Powered Matching
              </h1>
              <p className="text-lg text-slate-300">
                Connect job seekers with top employers through intelligent matching, real-time chat, and seamless application tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full px-8 py-6 text-lg font-semibold" data-testid="hero-get-started-btn">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#0F172A] rounded-full px-8 py-6 text-lg font-semibold" data-testid="hero-browse-jobs-btn">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758873268631-fa944fc5cad2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFscyUyMG1vZGVybiUyMG9mZmljZSUyMGNvbGxhYm9yYXRpb258ZW58MHx8fHwxNzY5MjMzMDI4fDA&ixlib=rb-4.1.0&q=85"
                alt="Professionals collaborating"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">Powerful Features for Everyone</h2>
            <p className="text-lg text-slate-600">Everything you need to find or hire the perfect match</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-ai-matching">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">AI-Powered Matching</h3>
              <p className="text-slate-600">Our intelligent algorithm matches job seekers with the most suitable positions based on skills, experience, and preferences.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-realtime-chat">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Real-Time Chat</h3>
              <p className="text-slate-600">Connect directly with recruiters and candidates through our built-in messaging system for faster communication.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-advanced-search">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Advanced Search</h3>
              <p className="text-slate-600">Filter jobs by location, salary range, skills, and job type to find exactly what you're looking for.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-application-tracking">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Application Tracking</h3>
              <p className="text-slate-600">Track all your job applications in one place and get real-time updates on your application status.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-recruiter-tools">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Recruiter Tools</h3>
              <p className="text-slate-600">Post jobs, manage applicants, and shortlist candidates with our comprehensive recruiter dashboard.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-slate-200 card-hover" data-testid="feature-analytics">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Admin Analytics</h3>
              <p className="text-slate-600">Comprehensive analytics and moderation tools to manage the platform effectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Create Your Profile</h3>
              <p className="text-slate-600">Sign up and build your professional profile with your skills, experience, and preferences.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Get Matched</h3>
              <p className="text-slate-600">Our AI analyzes your profile and recommends the best job opportunities tailored for you.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Apply & Connect</h3>
              <p className="text-slate-600">Apply to jobs with one click and chat directly with recruiters to land your dream job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0F172A] text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of job seekers and recruiters using JobConnect to build their careers.
          </p>
          <Link to="/register">
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full px-10 py-6 text-lg font-semibold" data-testid="cta-register-btn">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-[#4F46E5]" />
                <span className="text-xl font-bold text-[#0F172A]">JobConnect</span>
              </div>
              <p className="text-slate-600">Connecting talent with opportunity through intelligent matching.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/jobs" className="hover:text-[#4F46E5]">Browse Jobs</Link></li>
                <li><Link to="/register" className="hover:text-[#4F46E5]">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">For Recruiters</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/register" className="hover:text-[#4F46E5]">Post Jobs</Link></li>
                <li><Link to="/register" className="hover:text-[#4F46E5]">Find Talent</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-[#4F46E5]">About Us</a></li>
                <li><a href="#" className="hover:text-[#4F46E5]">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-600">
            <p>&copy; 2025 JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
