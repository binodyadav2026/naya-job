import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, MessageSquareText, Radar, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import api from '../utils/api';
import AuthShell from '../components/auth/AuthShell';
import AuthShowcase from '../components/auth/AuthShowcase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful!');

      if (user.role === 'job_seeker') {
        navigate('/jobseeker');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/jobseeker';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const aside = (
    <AuthShowcase
      eyebrow="Executive AI recruitment software"
      title="Sign back into a workspace designed for serious hiring teams."
      description="Naya Job keeps candidates, recruiters, and hiring decisions connected in one premium system with clean workflows and visible progress."
      stats={[
        { label: 'Pipeline clarity', value: 'Live', detail: 'Every status change and conversation stays connected.' },
        { label: 'Median response', value: '<24h', detail: 'A calmer system helps teams move faster without chaos.' },
      ]}
      highlights={[
        'Recruiter dashboards stay operational, not cluttered.',
        'Candidates get clearer status visibility and communication.',
      ]}
      bottomCard={
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
            <Bot className="h-5 w-5 text-violet-200" />
            <div className="mt-4 text-sm font-semibold text-white">AI-assisted matching</div>
            <p className="mt-2 text-sm leading-6 text-white/68">Fit signals stay embedded in the workflow.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
            <Radar className="h-5 w-5 text-cyan-200" />
            <div className="mt-4 text-sm font-semibold text-white">Shared hiring view</div>
            <p className="mt-2 text-sm leading-6 text-white/68">One place for pipeline and progress.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-200" />
            <div className="mt-4 text-sm font-semibold text-white">Trusted operations</div>
            <p className="mt-2 text-sm leading-6 text-white/68">A product that feels enterprise-ready.</p>
          </div>
        </div>
      }
    />
  );

  return (
    <AuthShell
      aside={aside}
      title="Welcome back"
      description="Sign in to access your Naya Job workspace, continue conversations, and pick up exactly where the hiring process left off."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
        <div className="grid gap-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-2 h-12 rounded-2xl border-slate-200 bg-slate-50 px-4"
              data-testid="email-input"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-2 h-12 rounded-2xl border-slate-200 bg-slate-50 px-4"
              data-testid="password-input"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="xl"
          className="w-full"
          disabled={loading}
          data-testid="login-submit-btn"
        >
          {loading ? 'Signing In...' : 'Sign In to Naya Job'}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
        onClick={handleGoogleLogin}
        data-testid="google-login-btn"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-4 w-4 text-accent" />
          Use the same account to access recruiter or candidate workflows based on your role.
        </div>
      </div>
    </AuthShell>
  );
}
