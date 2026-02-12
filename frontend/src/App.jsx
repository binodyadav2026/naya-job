import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicJobs from './pages/PublicJobs';
import PublicJobDetail from './pages/PublicJobDetail';
import AuthCallback from './pages/AuthCallback';

// Job Seeker pages
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import JobSeekerProfile from './pages/jobseeker/Profile';
import JobSearch from './pages/jobseeker/JobSearch';
import MyApplications from './pages/jobseeker/MyApplications';
import Messages from './pages/jobseeker/Messages';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterProfile from './pages/recruiter/Profile';
import PostJob from './pages/recruiter/PostJob';
import MyJobs from './pages/recruiter/MyJobs';
import Applicants from './pages/recruiter/Applicants';
import RecruiterMessages from './pages/recruiter/Messages';
import Subscription from './pages/recruiter/Subscription';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import JobModeration from './pages/admin/JobModeration';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function AppRouter() {
  const location = useLocation();

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  // Check URL fragment (not query params) for session_id - synchronous check during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<PublicJobs />} />
      <Route path="/jobs/:jobId" element={<PublicJobDetail />} />

      {/* Job Seeker routes */}
      <Route path="/jobseeker" element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
        <Route index element={<JobSeekerDashboard />} />
        <Route path="profile" element={<JobSeekerProfile />} />
        <Route path="search" element={<JobSearch />} />
        <Route path="jobs/:jobId" element={<PublicJobDetail />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      {/* Recruiter routes */}
      <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route index element={<RecruiterDashboard />} />
        <Route path="profile" element={<RecruiterProfile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="jobs/:jobId" element={<PublicJobDetail />} />
        <Route path="applicants/:jobId" element={<Applicants />} />
        <Route path="messages" element={<RecruiterMessages />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="jobs" element={<JobModeration />} />
        <Route path="jobs/:jobId" element={<PublicJobDetail />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ErrorBoundary>
          <AppRouter />
          <Toaster position="top-right" richColors />
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
