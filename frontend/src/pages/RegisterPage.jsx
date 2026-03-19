import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Sparkles, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import api from '../utils/api';
import AuthShell from '../components/auth/AuthShell';
import RoleShowcase from '../components/auth/RoleShowcase';
import { cn } from '@/lib/utils';

const roleOptions = [
  {
    value: 'job_seeker',
    label: 'Job Seeker',
    description: 'Find matched roles and track applications with clarity.',
    icon: UserRound,
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Publish jobs, review matches, and manage pipeline activity.',
    icon: BriefcaseBusiness,
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'job_seeker',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData((current) => ({ ...current, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created successfully!');

      if (user.role === 'job_seeker') {
        navigate('/jobseeker');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const redirectUrl = window.location.origin + '/jobseeker';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const aside = <RoleShowcase role={formData.role} />;

  return (
    <AuthShell
      aside={aside}
      title="Create your account"
      description="Choose the account type that matches how you use the platform, then step into a sharper Naya Job experience from day one."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
        <div>
          <Label htmlFor="role">Choose your role</Label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isActive = formData.role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRoleChange(option.value)}
                  className={cn(
                    'group rounded-[1.5rem] border p-4 text-left transition-[border-color,background-color,transform,box-shadow] duration-200',
                    isActive
                      ? 'border-accent bg-accent/[0.08] shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white'
                  )}
                  data-testid={`role-option-${option.value}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'rounded-2xl border p-3 transition-colors',
                        isActive
                          ? 'border-accent/20 bg-accent text-white'
                          : 'border-slate-200 bg-white text-slate-500'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{option.label}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-2 h-12 rounded-2xl border-slate-200 bg-slate-50 px-4"
              data-testid="name-input"
            />
          </div>

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

        <input type="hidden" name="role" value={formData.role} data-testid="role-select" />

        <Button
          type="submit"
          variant="accent"
          size="xl"
          className="w-full"
          disabled={loading}
          data-testid="register-submit-btn"
        >
          {loading ? 'Creating Account...' : 'Create Naya Job Account'}
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
        onClick={handleGoogleSignup}
        data-testid="google-signup-btn"
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
          <Sparkles className="h-4 w-4 text-accent" />
          Role-specific onboarding begins immediately after sign-up while staying fully consistent with the Naya Job brand system.
        </div>
      </div>
    </AuthShell>
  );
}
