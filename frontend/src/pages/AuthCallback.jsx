import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          toast.error('Authentication failed');
          navigate('/login');
          return;
        }

        // Exchange session_id for user data
        const response = await api.get('/auth/session', {
          headers: { 'X-Session-ID': sessionId },
        });

        const { user } = response.data;
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate to appropriate dashboard based on role
        if (user.role === 'job_seeker') {
          navigate('/jobseeker', { replace: true, state: { user } });
        } else if (user.role === 'recruiter') {
          navigate('/recruiter', { replace: true, state: { user } });
        } else if (user.role === 'admin') {
          navigate('/admin', { replace: true, state: { user } });
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    processSession();
  }, [navigate, location.hash]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mx-auto mb-4"></div>
        <p className="text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
}
