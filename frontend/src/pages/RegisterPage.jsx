import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, ArrowRight, Eye, EyeOff, CheckCircle, Users, Zap, TrendingUp, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';

// Role config — drives everything on the page
const ROLE_CONFIG = {
  job_seeker: {
    label: 'Job Seeker',
    emoji: '👨‍💼',
    tagline: 'Find your dream job',
    headline: 'Start Your Career Journey',
    sub: 'Join 18 lakh+ professionals finding better opportunities every day.',
    color: '#1E40AF',
    grad: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #2563EB 100%)',
    lightBg: '#EFF6FF',
    accentText: '#3B82F6',
    perks: [
      { icon: <Zap size={15} />, text: 'AI-matched to the right jobs instantly' },
      { icon: <TrendingUp size={15} />, text: 'Track all applications in one place' },
      { icon: <CheckCircle size={15} />, text: 'Chat directly with recruiters' },
    ],
    stats: [{ v: '2.4L+', l: 'Live Jobs' }, { v: '92%', l: 'Placement Rate' }, { v: '3 days', l: 'Avg. Time to Hire' }],
  },
  recruiter: {
    label: 'Recruiter',
    emoji: '🏢',
    tagline: 'Hire the best talent',
    headline: 'Start Hiring Smarter',
    sub: 'Access 18L+ verified candidates and fill positions in days, not months.',
    color: '#7C3AED',
    grad: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #8B5CF6 100%)',
    lightBg: '#F5F3FF',
    accentText: '#8B5CF6',
    perks: [
      { icon: <Users size={15} />, text: 'Access to 18L+ verified candidates' },
      { icon: <Zap size={15} />, text: 'AI shortlisting saves 80% of your time' },
      { icon: <TrendingUp size={15} />, text: 'Full hiring analytics dashboard' },
    ],
    stats: [{ v: '85K+', l: 'Companies' }, { v: '14 days', l: 'Avg. Hire Time' }, { v: '4.8★', l: 'Recruiter Rating' }],
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role comes from URL ?role=seeker or ?role=recruiter — set by landing page modal
  const rawRole = searchParams.get('role');
  const role = rawRole === 'recruiter' ? 'recruiter' : 'job_seeker';
  const cfg = ROLE_CONFIG[role];

  const [formData, setFormData] = useState({ email: '', password: '', name: '', role });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passStrength, setPassStrength] = useState(0);

  // Sync role into formData if URL param changes
  useEffect(() => {
    setFormData(f => ({ ...f, role }));
  }, [role]);

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setPassStrength(s);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (name === 'password') calcStrength(value);
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
      if (user.role === 'job_seeker') navigate('/jobseeker');
      else if (user.role === 'recruiter') navigate('/recruiter');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const redirectUrl = window.location.origin + (role === 'recruiter' ? '/recruiter' : '/jobseeker');
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const strengthColors = ['#E2E8F0', '#EF4444', '#F97316', '#EAB308', '#22C55E'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#F7F9FC' }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* LEFT PANEL */

.reg-left{
  position: fixed;
  top: 0;
  left: 0;
  width: 480px;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 48px 44px;
  overflow: hidden;

  flex-shrink: 0;
  z-index: 10;
}

/* BACKGROUND ELEMENTS */

.reg-left-bg{
  position: absolute;
  inset: 0;
  z-index: -1;
}

.reg-left-orb1{
  position: absolute;
  top: -80px;
  right: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.15;
}

.reg-left-orb2{
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  opacity: 0.1;
}

.reg-left-grid{
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* RIGHT PANEL */

.reg-right{
  margin-left: 480px;
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 48px 32px;
  min-height: 100vh;
}

.reg-form-box{
  width: 100%;
  max-width: 440px;
}

/* INPUT FIELDS */

.field-wrap{
  margin-bottom: 18px;
}

.field-label{
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}

.field-input{
  width: 100%;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;

  padding: 13px 16px;
  font-size: 14px;
  color: #0F172A;

  background: white;
  outline: none;

  transition: all 0.2s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.field-input:focus{
  border-color: var(--role-color,#1E40AF);
  box-shadow: 0 0 0 3px var(--role-shadow,rgba(30,64,175,0.1));
}

.field-input::placeholder{
  color:#94A3B8;
}

.field-input-wrap{
  position:relative;
}

.field-eye{
  position:absolute;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  border:none;
  background:none;
  cursor:pointer;

  color:#94A3B8;
  display:flex;
  align-items:center;

  transition:color .2s;
}

.field-eye:hover{
  color:#475569;
}

/* PASSWORD STRENGTH */

.pass-strength-bars{
  display:flex;
  gap:4px;
  margin-top:8px;
}

.pass-bar{
  height:3px;
  flex:1;
  border-radius:2px;
  transition:background .3s;
}

.pass-label{
  font-size:11px;
  font-weight:600;
  margin-top:4px;
}

/* BUTTONS */

.btn-submit{
  width:100%;
  border:none;
  border-radius:12px;

  padding:15px;
  font-size:15px;
  font-weight:800;
  color:white;

  cursor:pointer;
  transition:all .2s;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  font-family:'Plus Jakarta Sans',sans-serif;
  margin-top:6px;
}

.btn-submit:hover:not(:disabled){
  transform:translateY(-2px);
}

.btn-submit:disabled{
  opacity:.7;
  cursor:not-allowed;
}

.btn-google{
  width:100%;
  border:1.5px solid #E2E8F0;
  border-radius:12px;

  padding:13px;

  font-size:14px;
  font-weight:700;
  color:#374151;

  cursor:pointer;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;

  background:white;
  transition:all .2s;

  font-family:'Plus Jakarta Sans',sans-serif;
}

.btn-google:hover{
  border-color:#CBD5E1;
  background:#F8FAFC;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);
}

/* DIVIDER */

.divider{
  display:flex;
  align-items:center;
  gap:12px;
  margin:20px 0;
}

.divider-line{
  flex:1;
  height:1px;
  background:#E2E8F0;
}

.divider-text{
  font-size:12px;
  font-weight:600;
  color:#94A3B8;
}

/* ROLE CHIP */

.role-chip{
  display:inline-flex;
  align-items:center;
  gap:6px;

  border-radius:20px;
  padding:6px 14px;

  font-size:12px;
  font-weight:700;

  margin-bottom:28px;
  border:1.5px solid;
}

/* PERKS */

.perk-item{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:14px;
}

.perk-icon{
  width:32px;
  height:32px;
  border-radius:8px;

  display:flex;
  align-items:center;
  justify-content:center;

  flex-shrink:0;

  background:rgba(255,255,255,0.12);
  color:white;
}

.perk-text{
  font-size:13px;
  font-weight:500;
  line-height:1.4;
  color:rgba(255,255,255,0.8);
}

/* STATS */

.stat-row{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-top:32px;
}

.stat-box{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:12px;
  padding:14px 10px;
  text-align:center;
}

.stat-val{
  font-size:20px;
  font-weight:800;
  color:white;
}

.stat-lbl{
  font-size:11px;
  font-weight:600;
  margin-top:2px;
  color:rgba(255,255,255,0.5);
}

/* SWITCH ROLE */

.switch-role{
  display:flex;
  align-items:center;
  gap:6px;

  font-size:12px;
  margin-top:24px;

  color:rgba(255,255,255,0.55);
}

.switch-role a{
  color:rgba(255,255,255,0.85);
  font-weight:700;
  text-decoration:none;
}

.switch-role a:hover{
  color:white;
  text-decoration:underline;
}

/* ANIMATIONS */

@keyframes slideIn{
  from{opacity:0;transform:translateX(-20px)}
  to{opacity:1;transform:translateX(0)}
}

.slide-in{
  animation:slideIn .4s ease both;
}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(16px)}
  to{opacity:1;transform:translateY(0)}
}

.fade-up{
  animation:fadeUp .4s ease both;
}

.fade-up-1{animation-delay:.05s}
.fade-up-2{animation-delay:.1s}
.fade-up-3{animation-delay:.15s}
.fade-up-4{animation-delay:.2s}
.fade-up-5{animation-delay:.25s}

`}</style>

      {/* ── LEFT PANEL ── */}
      <div className="reg-left slide-in" style={{ '--role-color': cfg.color, background: cfg.grad }}>
        <div className="reg-left-orb1" style={{ background: 'white' }} />
        <div className="reg-left-orb2" style={{ background: 'white' }} />
        <div className="reg-left-grid" />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 52 }}>
            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <Briefcase size={17} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: 'white', fontSize: 18 }}>NayaJob</span>
          </Link>

          {/* Role badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 16 }}>{cfg.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.5px' }}>{cfg.label.toUpperCase()}</span>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.5px' }}>
            {cfg.headline}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36, maxWidth: 300 }}>
            {cfg.sub}
          </p>

          {/* Perks */}
          <div>
            {cfg.perks.map((p, i) => (
              <div key={i} className="perk-item">
                <div className="perk-icon">{p.icon}</div>
                <div className="perk-text">{p.text}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="stat-row">
            {cfg.stats.map(s => (
              <div key={s.l} className="stat-box">
                <div className="stat-val">{s.v}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Switch role link */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="switch-role">
            {role === 'job_seeker' ? (
              <>Looking to hire instead?{' '}
                <Link to="/register?role=recruiter">Switch to Recruiter →</Link>
              </>
            ) : (
              <>Looking for a job instead?{' '}
                <Link to="/register?role=seeker">Switch to Job Seeker →</Link>
              </>
            )}
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © 2025 NayaJob · Free forever · No credit card needed
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — FORM ── */}
      <div className="reg-right">
        <div className="reg-form-box">

          {/* Mobile logo */}
          <div style={{ display: 'none' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
              <Briefcase size={20} color={cfg.color} />
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 18 }}>NayaJob</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="fade-up fade-up-1" style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cfg.lightBg, border: `1px solid ${cfg.color}30`, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.tagline}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 6 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: cfg.color, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>

          {/* Google btn */}
          <div className="fade-up fade-up-2" style={{ marginBottom: 20 }}>
            <button className="btn-google" onClick={handleGoogleSignup} data-testid="google-signup-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="divider fade-up fade-up-2">
            <div className="divider-line" />
            <span className="divider-text">or register with email</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} data-testid="register-form">

            {/* Name */}
            <div className="field-wrap fade-up fade-up-3">
              <label className="field-label" htmlFor="name">Full Name</label>
              <div className="field-input-wrap">
                <input
                  id="name" name="name" type="text" required
                  className="field-input"
                  style={{ '--role-color': cfg.color, '--role-shadow': `${cfg.color}1A`, paddingLeft: 44 }}
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  data-testid="name-input"
                />
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusedField === 'name' ? cfg.color : '#CBD5E1', transition: 'color 0.2s' }}>
                  <User size={16} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="field-wrap fade-up fade-up-3">
              <label className="field-label" htmlFor="email">Email Address</label>
              <div className="field-input-wrap">
                <input
                  id="email" name="email" type="email" required
                  className="field-input"
                  style={{ '--role-color': cfg.color, '--role-shadow': `${cfg.color}1A`, paddingLeft: 44 }}
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  data-testid="email-input"
                />
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusedField === 'email' ? cfg.color : '#CBD5E1', transition: 'color 0.2s' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="field-wrap fade-up fade-up-4">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="field-input-wrap">
                <input
                  id="password" name="password" type={showPass ? 'text' : 'password'} required
                  className="field-input"
                  style={{ '--role-color': cfg.color, '--role-shadow': `${cfg.color}1A`, paddingLeft: 44, paddingRight: 44 }}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  data-testid="password-input"
                />
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focusedField === 'password' ? cfg.color : '#CBD5E1', transition: 'color 0.2s' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <button type="button" className="field-eye" onClick={() => setShowPass(s => !s)} style={{ color: focusedField === 'password' ? '#64748B' : '#CBD5E1' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="pass-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="pass-bar" style={{ background: passStrength >= i ? strengthColors[passStrength] : '#E2E8F0' }} />
                    ))}
                  </div>
                  <div className="pass-label" style={{ color: strengthColors[passStrength] }}>
                    {strengthLabels[passStrength]}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden role field — sent automatically */}
            <input type="hidden" name="role" value={formData.role} />

            {/* Role indicator (read-only) */}
            <div className="fade-up fade-up-4" style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: cfg.lightBg, border: `1.5px solid ${cfg.color}20`, borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>Registering as</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{cfg.label}</div>
                </div>
                <Link
                  to={role === 'job_seeker' ? '/register?role=recruiter' : '/register?role=seeker'}
                  style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Switch →
                </Link>
              </div>
            </div>

            {/* Submit */}
            <div className="fade-up fade-up-5">
              <button
                type="submit"
                className="btn-submit"
                style={{ background: cfg.grad, boxShadow: `0 6px 20px ${cfg.color}40` }}
                disabled={loading}
                data-testid="register-submit-btn"
              >
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    Creating account...
                  </>
                ) : (
                  <>Create My Account <ArrowRight size={16} /></>
                )}
              </button>
            </div>

            <p className="fade-up fade-up-5" style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 16, lineHeight: 1.6 }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: cfg.color, fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: cfg.color, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}